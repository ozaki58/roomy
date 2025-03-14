import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { createLike, deleteLike, UserDetailById } from "@/lib/data";
import { createNotification, getThreadOwner } from "@/lib/notifications";

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
      
      // スレッド作成者を取得
      const threadOwnerId = await getThreadOwner(threadId);
      
      // 自分自身のスレッドにいいねした場合は通知しない
      if (threadOwnerId && threadOwnerId !== user.id) {
        // ユーザー情報を取得
       const userData = await UserDetailById(user.id)
        
        const username = userData[0].username || 'ユーザー';
        const userImage = userData[0].image_url || null;
        
        // スレッド作成者に通知を作成（アクター情報を含む）
        await createNotification({
          userId: threadOwnerId,
          type: 'like',
          content: `${username}さんがあなたのスレッドにいいねしました`,
          relatedId: threadId,
          actorId: user.id,
          actorName: username,
          actorImage: userImage
        });
      }
      
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