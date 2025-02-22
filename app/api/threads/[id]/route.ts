// app/api/threads/[id]/route.ts
import { NextResponse } from "next/server";
import { fetchThreadById } from "@/lib/data";
import { deleteThreadById } from "@/lib/data";
// この API は特定のスレッドIDに基づく詳細情報を返します
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const threadId = params.id;
    
    const result = await fetchThreadById(threadId);
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    return NextResponse.json({ thread: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 });
  }
}




export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const threadId = params.id;
    const result = await deleteThreadById(threadId);
    if (result.length === 0) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    return NextResponse.json({ deletedThread: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return NextResponse.json({ error: "Failed to delete thread" }, { status: 500 });
  }
}
