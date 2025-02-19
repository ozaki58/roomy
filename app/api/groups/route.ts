import { NextResponse } from "next/server";
import { fetchAllGroupsByUser } from "@/lib/data";
import { sql } from "@vercel/postgres";
import { db } from "@vercel/postgres";
const client = await db.connect();
// GET リクエストを処理
export async function GET(req: Request) {
  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const isPublic = searchParams.get("isPublic");

    // クエリパラメータの確認
    if (!userId || isPublic === null) {
      return NextResponse.json(
        { error: "Missing userId or isPublic parameter." },
        { status: 400 }
      );
    }

    // データを取得
    const groups = await fetchAllGroupsByUser(userId, isPublic === "true");

    // データを返す
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



// POST メソッドでグループ作成を処理する
export async function POST(req: Request) {
  try {
    // リクエストボディからJSONをパース
    const { groupName, groupDescription, groupType, createdBy } = await req.json();

    // groupType が "public" なら is_public を true に変換
    const isPublic = groupType === "public";

    // groups テーブルにデータを挿入（テーブル設計に合わせてカラム名を修正してください）
    const result = await client.sql`
      INSERT INTO groups (name, description, is_public, created_by)
      VALUES (${groupName}, ${groupDescription}, ${isPublic}, ${createdBy})
      RETURNING *
    `;

    // 作成したグループデータを返す
    return NextResponse.json({ group: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json({ error: "Group creation failed" }, { status: 500 });
  }
}
