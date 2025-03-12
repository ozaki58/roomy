import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentActions from "./commentActions";
import { Comment, Thread } from "@/components/types";
import { UserProfileButton } from "./user-profile-modal";

interface CommentItemProps {
  comment: Comment;
  isInModall?: boolean;
  userId: string;
  onCommentDeleted?: (commentId: string) => void;
  isInModal?: boolean; // モーダル内かどうかを示すフラグを追加
}

const CommentItem = ({ 
  comment,
  userId, 
  onCommentDeleted,
  isInModal
}: CommentItemProps) => {
  return (
    <div className="flex items-start space-x-3 relative">
      <UserProfileButton 
        threadOrComment_user={comment.user} 
        login_user={userId} 
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="font-semibold">{comment.user.username}</div>
          <p className="text-sm whitespace-pre-line">{comment.content}</p>
        </div>
        <div className="text-xs text-gray-500 mt-1">{comment.created_at}</div>
      </div>
      
      {/* コメント削除ボタンはモーダル内でのみ表示 */}
      {isInModal && comment.user.id === userId && (
        <CommentActions 
          comment={comment} 
          onCommentDeleted={onCommentDeleted}
        />
      )}
    </div>
  );
};

export default React.memo(CommentItem);