
// DELETE : supprimer fournisseur
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/getUser";

export async function DELETE(req: Request) {
  const user = await getUser()
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    await prisma.supplier.delete({ where: { id, userId: user?.id } });
    return NextResponse.json({ message: "Fournisseur supprimé" });
  } catch (error) {
    return NextResponse.json(
      { error: `Erreur lors de la suppression : ${error}` },
      { status: 500 }
    );
  }
}