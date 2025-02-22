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

// ここで currentUserId はグローバル認証コンテキスト等から取得する方法もありますが、例として固定値
const currentUserId = "693ee2a0-35c5-43f7-8a49-8f92070ff844";

interface ThreadCardProps {
  thread: Thread;
  onCommentClick?: () => void;
  onThreadDeleted?: (threadId: string) => void; // 削除後のコールバック
}

const handleEdit = (id: string) => {
  console.log("Edit message:", id);
};

const deleteThread = async (threadId: string) => {
  try {
    const response = await fetch(`/api/threads/${threadId}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to delete thread");
    }
    const data = await response.json();
    return data.deletedThread;
  } catch (error) {
    console.error("Error deleting thread:", error);
    throw error;
  }
};

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onCommentClick, onThreadDeleted }) => {
  const handleDeleteClick = async () => {
    try {
      await deleteThread(thread.id);
      if (onThreadDeleted) {
        onThreadDeleted(thread.id);
      }
      else{console.log("koaaaaaaaaaaaaa")}
    } catch (error) {
      console.error("Error in delete handler:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-0 relative">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={thread.image_url} />
              <AvatarFallback>{thread.author}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{thread.author}</div>
              <div className="text-sm text-gray-500">{thread.date}</div>
            </div>
          </div>
          {/* 現在のユーザーが投稿者の場合のみドロップダウンメニューを表示 */}
          {thread.user_id === currentUserId && (
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
        <p className="mb-4">{thread.content}</p>
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
          {thread.comments.map((comment, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{comment.author}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-2">
                  <div className="font-semibold">{comment.author}</div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1">{comment.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
