import { NextResponse } from 'next/server';
import { fetchPopularThreadsByGroup } from '@/lib/data';
import { createClient } from '@/app/utils/supabase/server';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }
    
    const groupId = params.id;
    
    // 人気順（いいねが多い順）にスレッドを取得
    const threads = await fetchPopularThreadsByGroup(groupId);
    
    return NextResponse.json({ threads });
  } catch (error) {
    console.error('人気スレッド取得エラー:', error);
    return NextResponse.json(
      { error: 'スレッドの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 