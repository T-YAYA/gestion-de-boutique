import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/getUser";

export async function POST(req: NextRequest) {
    const user = await getUser();


    try {
        const data = await req.json();
        

        if(!data.name) return NextResponse.json({ error: "Veuillez entrer le nom de la catégorie." }, { status: 400 });
       
        const category = await prisma.category.create({
            data: {
                name: data.name,
                userId :user?.id
            },
        });
    
        
        
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: `Impossible d'ajouter la catégorie, ${error}` }, { status: 500 });
    }
}