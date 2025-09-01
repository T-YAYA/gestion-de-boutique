import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from '@/server/getUser';

interface Params {
  params: { id: string }; // id est toujours une string
}

export async function DELETE(req: Request, { params }: Params) {
  const user = await getUser();

  try {
    // Convertir id en nombre
    const id = parseInt(params.id, 10);

    // Supprimer le produit
    const deletedProduct = await prisma.product.delete({
      where: { id, userId:user?.id },
    });

    return NextResponse.json({
      message: "Produit supprimé avec succès",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Erreur suppression produit :", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le produit" },
      { status: 500 }
    );
  }
}
