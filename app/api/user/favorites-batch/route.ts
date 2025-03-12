import { NextRequest, NextResponse } from 'next/server';
import { fetchBatchFavoriteStatus } from '@/lib/data';
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
    
    const favoriteStatusMap = await fetchBatchFavoriteStatus(user.id, threadIds);
    
    // クライアント側で処理しやすいように配列形式に変換
    const favoritedThreadIds = Object.entries(favoriteStatusMap)
      .filter(([_, isFavorited]) => isFavorited)
      .map(([threadId, _]) => threadId);
    
    return NextResponse.json({ favoritedThreadIds });
  } catch (error) {
    console.error('お気に入り状態の一括取得エラー:', error);
    return NextResponse.json(
      { error: 'お気に入り状態の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 