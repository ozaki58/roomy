import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import postgres from 'postgres';

// PostgreSQL接続を設定
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    // 認証されたユーザーを取得
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証されていません" }, { status: 401 });
    }

    const userId = user.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    

    let queryStr = `
      SELECT 
        n.*,
        CASE
          WHEN n.type IN ('thread', 'comment', 'like') THEN
            (SELECT json_build_object(
              'id', t.id,
              'content', t.content,
              'group_id', t.group_id,
              'created_at', t.created_at,
              'user', json_build_object(
                'id', u.id,
                'username', u.username,
                'image_url', u.image_url
              )
            )
            FROM threads t
            LEFT JOIN users u ON t.user_id = u.id
            WHERE t.id = n.related_id
            LIMIT 1)
          ELSE NULL
        END AS thread_details,
        CASE
          WHEN n.type = 'comment' THEN
            (SELECT json_build_object(
              'id', c.id,
              'content', c.content,
              'thread_id', c.thread_id,
              'user', json_build_object(
                'id', u.id,
                'username', u.username,
                'image_url', u.image_url
              )
            )
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.id = n.related_id
            LIMIT 1)
          ELSE NULL
        END AS comment_details
      
      FROM notifications n
      WHERE n.user_id = $1
      ${type ? 'AND n.type = $2' : ''}
      ORDER BY n.created_at DESC
    `;
    
    let params = type ? [userId, type] : [userId];
    //コメントにもいいね機能をつけた場合はlike_threadとlike_commentで分けて適切なデータを取得する予定





    const notifications = await sql.unsafe(queryStr, params);
    
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('通知取得エラー:', error);
    return NextResponse.json({ error: '通知の取得に失敗しました' }, { status: 500 });
  }
}

// 通知を既読にするAPI
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    // 認証されたユーザーを取得
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }
    
    const userId = user.id;
    const { notificationIds } = await request.json();
    
    // 配列の検証
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json({ error: '有効な通知IDが提供されていません' }, { status: 400 });
    }
    
    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ${userId}
      AND id IN ${sql(notificationIds)}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('通知更新エラー:', error);
    return NextResponse.json({ error: '通知の更新に失敗しました' }, { status: 500 });
  }
} 