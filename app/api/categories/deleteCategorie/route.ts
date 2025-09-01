import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/getUser";
export async function DELETE(req: NextRequest) {
  const user = await getUser();

  try {
    const idParam = req.nextUrl.searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const id = Number(idParam);

    await prisma.category.delete({ where: { 
      id : id,
      userId : user?.id
    } });

    return NextResponse.json({ message: "Catégorie supprimée" });
  } catch (error) {
    console.error("Erreur suppression catégorie:", error);
    return NextResponse.json(
      { error: `Impossible de supprimer la catégorie: ${error}` },
      { status: 500 }
    );
  }
}
