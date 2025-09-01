import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";



export async function GET() {
    const supabase = await createClient();
    const { data} = await supabase.auth.getClaims ();
    if (!data?.claims.sub) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { id: data.claims.sub } });
    if(user){
        return NextResponse.json({message:"user already exist"} ,{status:200})
    }

    await prisma.user.create({
        data: {
          id: data.claims.sub,
          name: data.claims.user_metadata.name,
          email: data.claims.email,
        },
      });




    return NextResponse.json({message:"user created"} ,{status:200})
}