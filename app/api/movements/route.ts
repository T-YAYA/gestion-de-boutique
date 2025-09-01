import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from '@/server/getUser';

export async function GET() {
  const user = await getUser();

  try {
    // Récupérer les produits (achats)
    const products = await prisma.product.findMany({
      where: { userId:user?.id },
      include: {
        category: true,
        supplier: true,
      },
    });

    // Récupérer les ventes (sorties)
    const sales = await prisma.sale.findMany({
      where:{userId:user?.id},
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    // Transformer les produits en "mouvements" type achat
    const productMovements = products.map((p) => ({
      id: p.id,
      type: "Achat",
      product: p.name,
      category: p.category?.name || "-",
      quantity: (p.initStock || 0), // converti stock string -> int si nécessaire
      unitPrice: p.basePrice,
      date: p.createdAt.toISOString(),
      supplier: p.supplier?.name || "-",
    }));

    // Transformer les ventes en "mouvements" type vente
    const saleMovements = sales.map((s) => ({
      id: s.id,
      type: "Vente",
      product: s.product.name,
      category: s.product.category?.name || "-",
      quantity: s.quantity,
      unitPrice: s.product.price,
      date: s.createdAt.toISOString(),
      supplier: null,
    }));

    // Combiner et trier par date décroissante (les plus récents en premier)
    const movements = [...productMovements, ...saleMovements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(movements);
  } catch (error) {
    console.error("Erreur GET movements:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les mouvements" },
      { status: 500 }
    );
  }
}
