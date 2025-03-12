import { NextRequest, NextResponse } from 'next/server';
import { createFavorite, deleteFavorite } from '@/lib/data';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = params.id;
    const { favorite } = await request.json();
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }
    
    const userId = user.id;
    
    if (favorite) {
      // お気に入り追加
      await createFavorite(userId, threadId);
    } else {
      // お気に入り削除
      await deleteFavorite(userId, threadId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('お気に入り処理エラー:', error);
    return NextResponse.json(
      { error: 'お気に入りの更新に失敗しました' },
      { status: 500 }
    );
  }
} 