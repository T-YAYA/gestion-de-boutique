import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from '@/server/getUser';

export async function POST(req: Request) {
  const user = await getUser();

  try {
    const body = await req.json();
    const { name, stock, price, categoryId, supplierId } = body;

    if (!name || !stock || !price) {
      return NextResponse.json(
        { error: "Nom, stock et prix sont obligatoires" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        stock,
        initStock: stock,
        price: parseFloat(price),
        basePrice: parseFloat(price),
        userId:user?.id,
        categoryId: categoryId || null,
        supplierId: supplierId || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erreur ajout produit :", error);
    return NextResponse.json(
      { error: "Impossible d'ajouter le produit" },
      { status: 500 }
    );
  }
}
