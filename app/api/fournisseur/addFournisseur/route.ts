// POST : ajouter fournisseur
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/getUser";
export async function POST(req: Request) {
  const user = await getUser();
  try {
    const { name, phone } = await req.json();
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nom et téléphone requis" },
        { status: 400 }
      );
    }
    const fournisseur = await prisma.supplier.create({ data: { name, phone, userId: user?.id } });
    return NextResponse.json(fournisseur, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Erreur lors de l'ajout : ${error}` },
      { status: 500 }
    );
  }
}