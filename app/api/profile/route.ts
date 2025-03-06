import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { updateUserProfile } from "@/lib/data";
import { UserDetailById } from "@/lib/data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // FormData をパース
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    const interests = formData.get("interests") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | null = null;
    if (imageFile && imageFile.name) {
      // ファイル名のサニタイズと一意な名前の生成
      const sanitizedFileName = imageFile.name.replace(/\s+/g, "-");
      const fileName = `${Date.now()}-${userId}`;
      
      // Supabase Storage へ画像をアップロード
      const { error: uploadError } = await supabase
        .storage
        .from("profile-images")
        .upload(fileName, imageFile);
      
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }
      
      // 公開 URL を取得
      const { data: publicData } = supabase
        .storage
        .from("profile-images")
        .getPublicUrl(fileName);
      
      imageUrl = publicData.publicUrl;
    }


    const result = await updateUserProfile(userId, username, bio, interests, imageUrl ?? "");

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
  }
}


