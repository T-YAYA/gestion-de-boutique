import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from '@/server/getUser';

export async function GET() {
  const user = await getUser();

  try {
    const sales = await prisma.sale.findMany({
      where:{userId:user?.id},
      orderBy: { createdAt: "desc" },
      include: { product: true }, // inclure le produit pour le nom et prix
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Erreur fetch ventes :", error);
    return NextResponse.json({ error: "Impossible de récupérer les ventes" }, { status: 500 });
  }
}
