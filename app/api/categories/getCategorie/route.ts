// app/api/categories/getCategorie/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUser } from '@/server/getUser';

export async function GET() {
  const user = await getUser();
  try {
    const categories = await prisma.category.findMany({
      where:{
        userId: user?.id
      },
      select: {
        id: true,
        name: true,
        createdAt: true, // ⬅️ IMPORTANT: Inclure createdAt
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: `Erreur lors de la récupération des catégories : ${error}` },
      { status: 500 }
    );
  }
}