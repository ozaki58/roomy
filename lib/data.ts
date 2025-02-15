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
export async function fetchUsers() {
  try {

    const data = await sql<User>`SELECT * FROM users`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function fetchAllGroups() {
  try {
    const data = await sql<Group>
      `SELECT * 
       FROM groups`;
    return data.rows;
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the AllGroups.');
  }
}
//publicかどうかで条件分岐
export async function fetchAllGroupsByUser(userId: string, isPublic: boolean) {
    try {
      console.log("Running query with:", { userId, isPublic }); // パラメータのログ
      const data = await client.sql<Group>`
        SELECT * 
        FROM groups g 
        JOIN user_groups ug ON g.id = ug.group_id
        WHERE ug.user_id = ${userId} AND g.is_public = ${isPublic}`;
      console.log("Query result:", data.rows); // クエリ結果のログ
      return data.rows;
    } catch (error) {
      console.error("Database query error:", error); // クエリエラーのログ
      throw error;
    }
  }
  
  
