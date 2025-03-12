// app/api/threads/route.ts
import { NextResponse } from "next/server";
import { createThread, fetchCommentsByGroup, fetchThreadsByGroup } from "@/lib/data";
import { createClient } from '@/app/utils/supabase/server';
// POST: スレッド作成エンドポイント
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    } 
    const createdBy = user.id;
    const { groupId, content } = await req.json();
    const result = await createThread(groupId, content, createdBy);
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
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ error: "Missing groupId parameter" }, { status: 400 });
    }

    const data = await fetchThreadsByGroup(groupId);
    return NextResponse.json({ threads: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 });
  }
}
// app/api/threads/[id]/route.ts




