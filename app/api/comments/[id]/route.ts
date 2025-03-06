
import { NextResponse } from "next/server";

import { deleteCommentById } from "@/lib/data";



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const commentId = params.id;
    const result = await deleteCommentById(commentId);
    if (result.length === 0) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ deletedComment: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Comment:", error);
    return NextResponse.json({ error: "Failed to delete Comment" }, { status: 500 });
  }
}
