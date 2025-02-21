import { NextResponse } from "next/server";
import { fetchAllGroupsByUser, fetchAllPublicGroups, createGroupByUser } from "@/lib/data";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get("isPublic");
    const userId = searchParams.get("userId");

  

    let groups;
    if (userId) {
      // ユーザーに紐づくグループ（公開・非公開）の取得
      groups = await fetchAllGroupsByUser(userId, isPublic === "true");
    } else {
      // userId がない場合は、公開グループのみを返す
      if (isPublic === "true") {
        groups = await fetchAllPublicGroups();
      } else {
        // userId が指定されていない状態で非公開グループを要求された場合はエラーにする
        return NextResponse.json(
          { error: "UserId is required for non-public groups." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { groupName, groupDescription, groupType, createdBy } = await req.json();
    const result = await createGroupByUser(groupName, groupDescription, groupType, createdBy);
    return NextResponse.json({ group: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json({ error: "Group creation failed" }, { status: 500 });
  }
}
