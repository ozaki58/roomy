import { NextRequest, NextResponse } from 'next/server';
import { fetchBatchLikeStatus } from '@/lib/data';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }
    
    const { threadIds } = await request.json();
    
    if (!threadIds || !Array.isArray(threadIds) || threadIds.length === 0) {
      return NextResponse.json(
        { error: 'スレッドIDの配列が必要です' },
        { status: 400 }
      );
    }
    
    const likedStatusMap = await fetchBatchLikeStatus(user.id, threadIds);
    
    // クライアント側で処理しやすいように配列形式に変換
    const likedThreadIds = Object.entries(likedStatusMap)
      .filter(([_, isLiked]) => isLiked)
      .map(([threadId, _]) => threadId);
    
    return NextResponse.json({ likedThreadIds });
  } catch (error) {
    console.error('いいね状態の一括取得エラー:', error);
    return NextResponse.json(
      { error: 'いいね状態の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}