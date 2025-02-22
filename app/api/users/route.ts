import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { updateUserProfile } from "@/lib/data";
import { UserDetailById } from "@/lib/data";
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const userId = params.id;
  
      
      const result = await UserDetailById(userId)
      if (result.length === 0) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }
      
    
      return NextResponse.json({ user: result[0] }, { status: 200 });
    } catch (error) {
      console.error("Error fetching group details:", error);
      return NextResponse.json({ error: "Failed to fetch group details" }, { status: 500 });
    }
  }