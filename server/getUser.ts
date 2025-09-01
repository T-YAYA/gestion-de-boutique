import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";


export async function getUser() {
    const supabase = await createClient();
    const {data} = await supabase.auth.getClaims();
    const userId = data?.claims.sub
    const user = await prisma.user.findUnique({ where: { id: userId } });
     
    
    return user;
}