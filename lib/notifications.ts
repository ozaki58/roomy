import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 通知タイプ
export type NotificationType = 'thread' | 'comment' | 'like' | 'group' | 'system' | 'mention';

// 通知作成関数
export async function createNotification({
  userId,
  type,
  content,
  relatedId
}: {
  userId: string;
  type: NotificationType;
  content: string;
  relatedId?: string;
}) {
  try {
    const result = await sql`
      INSERT INTO notifications (
        user_id,
        type,
        content,
        related_id,
        is_read
      ) VALUES (
        ${userId},
        ${type},
        ${content},
        ${relatedId || null},
        false
      ) RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error('通知作成エラー:', error);
    throw error;
  }
}

// スレッド作成者を取得する関数
export async function getThreadOwner(threadId: string) {
  try {
    const result = await sql`
      SELECT user_id FROM threads
      WHERE id = ${threadId}
      LIMIT 1
    `;
    
    return result.length > 0 ? result[0].user_id : null;
  } catch (error) {
    console.error('スレッド作成者取得エラー:', error);
    return null;
  }
}

// グループメンバーを取得する関数
export async function getGroupMembers(groupId: string) {
  try {
    const result = await sql`
      SELECT user_id FROM user_groups
      WHERE group_id = ${groupId}
    `;
    
    return result.map(row => row.user_id);
  } catch (error) {
    console.error('グループメンバー取得エラー:', error);
    return [];
  }
} 