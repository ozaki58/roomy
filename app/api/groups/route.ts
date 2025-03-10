
import { fetchAllGroupsByUser, fetchAllPublicGroups, createGroupByUser } from "@/lib/data";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { create } from "domain";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const formData = await req.formData();
    const groupName = formData.get('groupName') as string;
    const groupDescription = formData.get('groupDescription') as string;
    const groupType = formData.get('groupType') as string;
    const createdBy = formData.get('createdBy') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl: string | null = null;
    if (imageFile && imageFile.name) {
      // ファイル名のサニタイズと一意な名前の生成
      const sanitizedFileName = imageFile.name.replace(/\s+/g, "-");
      const fileName = `${Date.now()}-${createdBy}`;
      
      // Supabase Storage へ画像をアップロード
      const { error: uploadError } = await supabase
        .storage
        .from("group-images")
        .upload(fileName, imageFile);
      
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }
      
      // 公開 URL を取得
      const { data: publicData } = supabase
        .storage
        .from("group-images")
        .getPublicUrl(fileName);
      
      imageUrl = publicData.publicUrl;
    }


    const result = await createGroupByUser(groupName, groupDescription, groupType, createdBy,imageUrl ?? "");
    return NextResponse.json({ group: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json({ error: "Group creation failed" }, { status: 500 });
  }
}
