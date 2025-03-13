// app/api/threads/route.ts
import { NextResponse } from "next/server";
import { createCommentByUser, createThread, fetchCommentsByGroup, fetchThreadsByGroup, UserDetailById } from "@/lib/data";
import { createNotification, getThreadOwner } from "@/lib/notifications";
import { createClient } from '@/app/utils/supabase/server';

// POST: スレッド作成エンドポイント
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }
    
    const { threadId, content } = await req.json();
    const createdBy = user.id;
    
    // コメントを作成
    const result = await createCommentByUser(threadId, content, createdBy);
    
    // スレッド作成者を取得
    const threadOwnerId = await getThreadOwner(threadId);
    
    // 自分自身のスレッドにコメントした場合は通知しない
    if (threadOwnerId && threadOwnerId !== createdBy) {
      // ユーザー名を取得（UI用）
      const userData = await UserDetailById(createdBy);
      
      const username = userData[0].username || 'ユーザー';
      
      // スレッド作成者に通知を作成
      await createNotification({
        userId: threadOwnerId,
        type: 'comment',
        content: `${username}さんがあなたのスレッドにコメントしました`,
        relatedId: threadId
      });
    }
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Comment creation failed" }, { status: 500 });
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
