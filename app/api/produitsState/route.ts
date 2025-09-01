// src/app/api/products/overview/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from '@/server/getUser';

export async function GET() {
  const user = await getUser();

  try {
    // Produits avec stock faible
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 } , userId:user?.id },
      orderBy: { createdAt: "desc" }, // optionnel : les plus récents en premier
      include: { category: true },
    });

    // 5 produits les plus récents
    const recentProducts = await prisma.product.findMany({
      where:{userId:user?.id},
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    });

    return NextResponse.json({
      lowStockProducts,
      recentProducts,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les produits" },
      { status: 500 }
    );
  }
}
