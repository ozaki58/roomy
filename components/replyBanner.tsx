import React from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Thread } from "./types";

interface ReplyBannerProps {
  commentCount: number;
  onReplyClick: () => void;
}

export default function ReplyBanner({ commentCount, onReplyClick }: ReplyBannerProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto p-2 bg-gray-200 rounded-lg shadow">
      <button
        className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
        onClick={onReplyClick}
      >
        {commentCount}件の返信
      </button>
     
    </div>
  );
}