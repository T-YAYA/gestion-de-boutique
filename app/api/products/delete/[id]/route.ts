import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/getUser";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getUser();

  try {
    // Récupérer l'id depuis params
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);

    // Supprimer le produit
    const deletedProduct = await prisma.product.delete({
      where: { id, userId: user?.id },
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
