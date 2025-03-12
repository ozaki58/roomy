import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { createLike, deleteLike } from "@/lib/data";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }  // [id] フォルダ名に合わせる
) {
  try {
    const threadId = params.id;  // URLパラメータから threadId を取得
    const supabase = await createClient();
    
    // 認証されたユーザーを取得
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証されていません" }, { status: 401 });
    }

    const { like } = await request.json();
 
    if (like) {
      const result = await createLike(user.id, threadId);
      return NextResponse.json(result);
    } else {
      const result = await deleteLike(user.id, threadId);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("いいね処理エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}