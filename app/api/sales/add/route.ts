import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from '@/server/getUser';

export async function POST(req: Request) {
  const user = await getUser();

  try {
    const { productId, quantity } = await req.json();

    if (!productId || quantity <= 0) {
      return NextResponse.json({ error: "Produit ou quantité invalide" }, { status: 400 });
    }

    // Vérifier le stock du produit
    const product = await prisma.product.findUnique({ where: { id: productId, userId:user?.id } });
    if (!product) return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });

    if (quantity > Number(product.stock)) {
      return NextResponse.json({ error: "Quantité supérieure au stock disponible" }, { status: 400 });
    }

    // Calcul du prix total
    const totalPrice = product.price * quantity;

    // Créer la vente
    const sale = await prisma.sale.create({
      data: {
        quantity,
        totalPrice,
        user: { connect: { id: user?.id } },
        product: { connect: { id: productId } },
      },
      include: { product: true },
    });

    // Mettre à jour le stock du produit
    await prisma.product.update({
      where: { id: productId, userId:user?.id },
      data: { stock: (product.stock) - quantity }, // Stock est string dans ton schéma
    });

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Erreur ajout vente :", error);
    return NextResponse.json({ error: "Impossible d'ajouter la vente" }, { status: 500 });
  }
}
