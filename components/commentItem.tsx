import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentActions from "./commentActions";

interface Comment {
  id: string;
  image_url: string;
  author: string;
  user_id: string;
  content: string;
  date: string;
}

interface CommentItemProps {
  comment: Comment;
  userId: string;
  onCommentDeleted?: (commentId: string) => void;
}

const CommentItem = ({ comment, userId, onCommentDeleted }: CommentItemProps) => {
  return (
    <div className="flex items-start space-x-3 relative">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.image_url} />
        <AvatarFallback>{comment.author}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="font-semibold">{comment.author}</div>
          <p className="text-sm">{comment.content}</p>
        </div>
        <div className="text-xs text-gray-500 mt-1">{comment.date}</div>
      </div>
      {comment.user_id === userId && (
        <CommentActions 
          comment={comment} 
          onCommentDeleted={onCommentDeleted}
        />
      )}
    </div>
  );
};

export default React.memo(CommentItem);