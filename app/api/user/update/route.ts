import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/getUser";
import { createClient } from "@/lib/supabase/server";



export async function PUT(req: NextRequest) {
    const supabase = await createClient();
    const user = await getUser();
    if (!user?.id) return NextResponse.json({ error: "User not found" }, { status: 404 });


    try {
        const { name } = await req.json();
        supabase.auth.updateUser({ data: { user_metadata: { name } } });
        await prisma.user.update({ where: { id: user.id }, data: { name } });
        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Error updating user" }, { status: 500 });
    }
}