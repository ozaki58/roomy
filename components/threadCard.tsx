import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thread } from "@/components/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import CommentItem from "./commentItem";
import { useThreadActions } from "@/app/hooks/useThreadActions";
import ErrorBoundary from "./errorBoundary";
import { CommentError } from "./error";
import { UserProfileButton } from "./user-profile-modal";
import { login } from "@/app/login/action";

interface ThreadCardProps {
  thread: Thread;
  onCommentClick?: () => void;
  userId: string;
  login_userName?: string;
  onCommentDeleted?: (commentId: string) => void;
  onThreadDeleted?: (threadId: string) => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  onCommentClick,
  userId,
  login_userName,
  onCommentDeleted,
  onThreadDeleted
}) => {
  const { deleteThread } = useThreadActions();
  
  const handleDeleteClick = async () => {
    try {
      await deleteThread(thread.id);
      if (onThreadDeleted) {
        onThreadDeleted(thread.id);
      }
    } catch (error) {
      console.error("スレッド削除エラー:", error);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit message:", id);
    // 編集機能の実装（今後の拡張用）
  };

  return (
    <div className="bg-white rounded-lg shadow mb-0 relative">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <UserProfileButton threadOrComment_user={thread.user} login_user={userId} login_username={login_userName} />
            <div>
              <div className="font-semibold">{thread.user.username}</div>
              <div className="text-sm text-gray-500">{thread.date}</div>
            </div>
          </div>
          {thread.user.id === userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(thread.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick}>
                  <Trash className="mr-2 h-4 w-4" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="mb-4 whitespace-pre-line">{thread.content}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <button className="flex items-center space-x-1">
            <span>{thread.reactions}</span>
            <span>{thread.reactionCount}</span>
          </button>
          <button onClick={onCommentClick} className="hover:underline">
            コメント {thread.commentCount}
          </button>
          <button>共有する {thread.shareCount}</button>
        </div>
        
      </div>
      <div className="border-t p-4">
        <div className="space-y-4">
          {thread.comments && thread.comments.map((comment, index) => (
            <ErrorBoundary
            key={comment.id}
            fallback={<CommentError comment={comment} />}
          >
            <CommentItem 
              key={comment.id || index} 
              comment={comment} 
              userId={userId} 
              login_userName={login_userName}
              onCommentDeleted={onCommentDeleted}
            />
            </ErrorBoundary>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ThreadCard);