import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from '@/server/getUser';

export async function GET() {
  const user = await getUser();

  try {
    const products = await prisma.product.findMany({
      where: { userId:user?.id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    
    return NextResponse.json(
      { 
        error: "Erreur serveur lors de la récupération des produits",
        details: process.env.NODE_ENV === "development" ? error : undefined
      },
      { status: 500 }
    );
  }
}