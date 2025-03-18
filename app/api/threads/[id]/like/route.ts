import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { createLike, deleteLike, UserDetailById } from "@/lib/data";
import { createNotification, getThreadOwner } from "@/lib/notifications";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } 
) {
  try {
    const threadId = params.id;  
    const supabase = await createClient();
    

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証されていません" }, { status: 401 });
    }

    const { like } = await request.json();
 
    if (like) {
      const result = await createLike(user.id, threadId);
      
 
      const threadOwnerId = await getThreadOwner(threadId);
      
 
      if (threadOwnerId && threadOwnerId !== user.id) {
    
       const userData = await UserDetailById(user.id)
        
        const username = userData[0].username || 'ユーザー';
        const userImage = userData[0].image_url || null;
      
        await createNotification({
          userId: threadOwnerId,
          type: 'like',         //コメントにいいね機能をつけた際はここをlike_threadに変更する予定
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