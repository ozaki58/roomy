// ThreadCard.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thread } from "@/components/types";
import { Button } from "@/components/ui/button";

interface ThreadCardProps {
  thread: Thread;
  onCommentClick?: () => void; 
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onCommentClick }) => (
  <div className="bg-white rounded-lg shadow mb-0">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{thread.author}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{thread.author}</div>
            <div className="text-sm text-gray-500">{thread.date}</div>
          </div>
        </div>
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

export default ThreadCard;
