import { NextResponse } from "next/server";
import { fetchAllGroupsByUser } from "@/lib/data";
import { createGroupByUser } from "@/lib/data";
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

 
    const result = await createGroupByUser(groupName, groupDescription, groupType, createdBy)

    // 作成したグループデータを返す
    return NextResponse.json({ group: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json({ error: "Group creation failed" }, { status: 500 });
  }
}
