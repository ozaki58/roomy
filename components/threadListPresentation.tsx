import React, { useEffect, useState, useCallback, lazy, Suspense } from "react";
import ThreadCard from "@/components/threadCard";
import Modal from "./modal";
import { TextareaForm } from "./textareaForm";
import { Thread } from "@/components/types";

const ThreadDetailModal = lazy(() => import('./threadDetailModal'));
interface ThreadListPresentationProps {
    threads: Thread[];
    userId: string;
    selectedThread: Thread | null;
    isModalOpen: boolean;
    onCloseModal: () => void;
    onCommentClick: (thread: Thread) => void;
    onAddComment: (content: string) => Promise<void>;
    onCommentDeleted: ( commentId: string) => void;
    onThreadDeleted: (threadId: string ) => void;
  }
  
  // 表示のみを担当するコンポーネント
  export default function ThreadListPresentation({
    threads,
    userId,
    selectedThread,
    isModalOpen,
    onCloseModal,
    onCommentClick,
    onAddComment,
    onCommentDeleted,
    onThreadDeleted
  }: ThreadListPresentationProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {threads.map((thread, index) => (
            <ThreadCard
              key={thread.id || index}
              thread={{ ...thread, comments: (thread.comments || []).slice(0, 2) }}
              onCommentClick={() => onCommentClick(thread)}
              userId={userId}
              onThreadDeleted={onThreadDeleted}
            />
          ))}
        </div>
      </main>

      {isModalOpen && (
        <Suspense fallback={<div className="text-center p-4">読み込み中...</div>}>
          <ThreadDetailModal
            thread={selectedThread}
            userId={userId}
            onClose={onCloseModal}
            onCommentDeleted={onCommentDeleted}
            onThreadDeleted={onThreadDeleted}
            onAddComment={onAddComment}
          />
        </Suspense>
      )}
    </div>
  );
}