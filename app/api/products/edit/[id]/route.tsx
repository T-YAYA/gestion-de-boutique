import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/getUser";

interface Params {
  params: { id: string }; // id est toujours une string
}

export async function PUT(req: Request, { params }: Params) {
  const user = await getUser();

  try {
    // Convertir l'id en nombre
    const id = parseInt(params.id, 10);

    const body = await req.json();
    const { name, stock, price, categoryId, supplierId } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        stock: stock,
        price: parseFloat(price), // ✅ convertit price en float
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
