import { NextResponse } from "next/server";
import { checkThreadLiked} from "@/lib/data";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const threadId = searchParams.get("threadId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }
    if (!threadId) {
      return NextResponse.json({ error: "Missing threadId parameter" }, { status: 400 });
    }
  
    const isLiked = await checkThreadLiked(userId, threadId);
    return NextResponse.json({ isLiked }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Likedship:", error);
    return NextResponse.json({ error: "Failed to fetch Likedship" }, { status: 500 });
  }
}
