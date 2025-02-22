// app/api/groups/leave/route.ts
import { NextResponse } from "next/server";
import { leaveGroup } from "@/lib/data"; // leaveGroup 関数を実装しておく

export async function POST(req: Request) {
  try {
    const { userId, groupId } = await req.json();
    const result = await leaveGroup(userId, groupId);
    return NextResponse.json({ left: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error leaving group:", error);
    return NextResponse.json({ error: "Group leave failed" }, { status: 500 });
  }
}
