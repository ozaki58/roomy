import { sql } from '@vercel/postgres';
import {
    User,
    Group,
    Thread,
    Comment,
    User_Group,

} from './definitions';
import { db } from "@vercel/postgres";
const client = await db.connect();

//publicかどうかで条件分岐
export async function fetchAllGroupsByUser(userId: string, isPublic: boolean) {
  try {
    console.log("Running query with:", { userId, isPublic });
   
    const data = await client.sql`
      SELECT 
        g.id ,
        g.name,
        g.description,
        g.members,
        g.is_public,
        g.created_by
      FROM groups g 
      JOIN user_groups ug ON g.id = ug.group_id
      WHERE ug.user_id = ${userId} AND g.is_public = ${isPublic}
    `;
    console.log("Query result:", data.rows);
    return data.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

  export async function createGroupByUser(groupName:string, groupDescription:string, groupType:string, createdBy:string){
    try {
         // groupType が "public" なら is_public を true に変換
    const isPublic = groupType === "public";
    // groups テーブルにデータを挿入（テーブル設計に合わせてカラム名を修正してください）
    const result = await client.sql`
    INSERT INTO groups (name, description, is_public, created_by)
    VALUES (${groupName}, ${groupDescription}, ${isPublic}, ${createdBy})
    RETURNING *
    `;
    return result
    }
    catch (error) {
      console.error("Database query error:", error); // クエリエラーのログ
      throw error;
    }
  }
  
// スレッド作成関数
export async function createThread(
  groupId: string,
  title: string,
  content: string,
  createdBy: string
) {
  const result = await client.sql`
    INSERT INTO threads (group_id, title, content, created_by)
    VALUES (${groupId}, ${title}, ${content}, ${createdBy})
    RETURNING *
  `;
  return result;
}

// グループIDに基づいてスレッド一覧を取得する関数
export async function fetchThreadsByGroup(groupId: string) {
  const result = await client.sql`
    SELECT
      t.id,
      t.group_id,
      t.user_id,
      t.title,
      t.content,
      t.created_at,
      u.username AS author
    FROM threads t
    LEFT JOIN users u ON t.user_id = u.id
    WHERE t.group_id = ${groupId}
    ORDER BY t.created_at DESC
  `;
  return result;
 
}