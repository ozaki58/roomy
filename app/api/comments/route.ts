// app/api/threads/route.ts
import { NextResponse } from "next/server";
import { createCommentByUser, createThread, fetchCommentsByGroup, fetchThreadsByGroup } from "@/lib/data";

// POST: スレッド作成エンドポイント
export async function POST(req: Request) {
  try {
    const { threadId, content, createdBy } = await req.json();
    const result = await createCommentByUser(threadId, content, createdBy);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json({ error: "Thread creation failed" }, { status: 500 });
  }
}

// GET: 指定したグループのスレッド一覧取得エンドポイント
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get("threadId");

    if (!threadId) {
      return NextResponse.json({ error: "Missing threadId parameter" }, { status: 400 });
    }

    const data = await fetchCommentsByGroup(threadId);
    return NextResponse.json({ threads: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 });
  }
}
