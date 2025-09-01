// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from '@/server/getUser';

export async function GET() {
  const user = await getUser();

  try {
    const totalProducts = await prisma.product.count();
    const lowStock = await prisma.product.count({
      where: { stock: { lte: 5 }, userId:user?.id }, // seuil stock faible
    });
    const recentachat = await prisma.sale.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
        },
        userId:user?.id
      },
    });
    const recentvente = await prisma.product.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
        },
        userId:user?.id
      },
    })
    const products = await prisma.product.findMany({
      where:{userId:user?.id},
    select: { price: true, stock: true },
    });

    const stockValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);


    return NextResponse.json({
      totalProducts,
      lowStock,
      recentMovements: recentachat + recentvente,
      stockValue: stockValue ?? 0,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur lors du fetch des stats" }, { status: 500 });
  }
}
