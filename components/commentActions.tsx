import React, { use } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { useComments } from "@/app/hooks/useComments";
import { Comment, Thread } from "./types";
import { useCommentActions } from "@/app/hooks/useCommentActions";
interface CommentActionsProps {

  comment: Comment;
  onCommentDeleted?: (commentId: string) => void;
}

export default function CommentActions({ comment, onCommentDeleted }: CommentActionsProps) {
 
  const { deleteComment } = useCommentActions();
  const handleCommentDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      if (onCommentDeleted) {
        onCommentDeleted(commentId);
      }
    } catch (error) {
      console.error("コメント削除エラー:", error);
    }
  };
  
  return (

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute right-2 top-2">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleCommentDelete(comment.id)}>
          <Trash className="mr-2 h-4 w-4" />
          削除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}