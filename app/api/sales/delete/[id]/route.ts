import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from '@/server/getUser';

interface Params {
  params: { id: string };
}

export async function DELETE(req: Request, { params }: Params) {
  const user = await getUser();

  try {
    const id = parseInt(params.id, 10);

    // Trouver la vente pour restaurer le stock
    const sale = await prisma.sale.findUnique({ where: { id, userId:user?.id } });
    if (!sale) return NextResponse.json({ error: "Vente non trouvée" }, { status: 404 });

    // Restaurer le stock du produit
    const product = await prisma.product.findUnique({ where: { id: sale.productId, userId:user?.id } });
    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: (product.stock) + (sale.quantity) },
      });
    }

    // Supprimer la vente
    await prisma.sale.delete({ where: { id, userId:user?.id } });

    return NextResponse.json({ message: "Vente supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression vente :", error);
    return NextResponse.json({ error: "Impossible de supprimer la vente" }, { status: 500 });
  }
}
