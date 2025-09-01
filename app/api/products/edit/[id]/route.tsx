import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/getUser";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getUser();

  try {
    // Récupérer l'id depuis params
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);

    // Récupérer le body
    const body = await request.json();
    const { name, stock, price, categoryId, supplierId } = body;

    // Mettre à jour le produit
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        stock: stock,
        price: parseFloat(price), // convertit price en float
        userId: user?.id,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        supplierId: supplierId ? parseInt(supplierId, 10) : null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erreur modification produit :", error);
    return NextResponse.json(
      { error: "Impossible de modifier le produit" },
      { status: 500 }
    );
  }
}
