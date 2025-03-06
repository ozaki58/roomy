export const dynamic = "force-dynamic"; 
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { GroupDetailById } from "@/lib/data";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const groupId = params.id;

    
    const result = await GroupDetailById(groupId)
    if (result.length === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
  
    return NextResponse.json({ group: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching group details:", error);
    return NextResponse.json({ error: "Failed to fetch group details" }, { status: 500 });
  }
}
