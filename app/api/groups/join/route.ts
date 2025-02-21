import { NextResponse } from "next/server";
import { checkJoinGroup, joinGroup } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const { userId, groupId } = await req.json();
    
    const result = await joinGroup(userId, groupId);
    return NextResponse.json({ joined: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json({ error: "Group join failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const groupId = searchParams.get("groupId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }
    if (!groupId) {
      return NextResponse.json({ error: "Missing groupId parameter" }, { status: 400 });
    }
  
    const isMember = await checkJoinGroup(userId, groupId);
    return NextResponse.json({ isMember }, { status: 200 });
  } catch (error) {
    console.error("Error fetching membership:", error);
    return NextResponse.json({ error: "Failed to fetch membership" }, { status: 500 });
  }
}
