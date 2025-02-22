"use client";
import React, { useEffect, useState } from "react";
import ThreadCard from "@/components/threadCard";
import Modal from "./modal";
import { TextareaForm } from "./textareaForm";
import { Thread, Comment } from "@/components/types";

interface ThreadListProps {
  threads?: Thread[];
  onThreadDeleted: (deletedThreadId: string) => void;
}

export default function ThreadList({ threads: initialThreads = [], onThreadDeleted }: ThreadListProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setThreads(initialThreads || []);
  }, [initialThreads]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedThread(null);
  };

  const handleCommentClick = (thread: Thread) => {
    setSelectedThread(thread);
    setIsModalOpen(true);
  };

  // コメント投稿後に対象スレッドのみ再フェッチする処理はそのまま
  const addComment = async (newComment: Comment) => {
    if (!selectedThread) return;
    try {
      const response = await fetch(`/api/threads/${selectedThread.id}`);
      if (!response.ok) throw new Error("Failed to fetch updated thread");
      const data = await response.json();
      const updatedThread: Thread = data.thread;
      setSelectedThread(updatedThread);
      setThreads(prevThreads =>
        prevThreads.map(thread => (thread.id === updatedThread.id ? updatedThread : thread))
      );
    } catch (error) {
      console.error("Error re-fetching thread:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {threads.map((thread, index) => (
            <div key={thread.id || index} className="mb-0">
              <ThreadCard
                thread={{ ...thread, comments: (thread.comments || []).slice(0, 2) }}
                onCommentClick={() => handleCommentClick(thread)}
                onThreadDeleted={onThreadDeleted}
              />
            </div>
          ))}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        {selectedThread && (
          <div>
            <h2 className="text-xl font-semibold mb-4">返信スレッド</h2>
            <ThreadCard thread={selectedThread} />
            <TextareaForm addComment={addComment} threadId={selectedThread.id} />
          </div>
        )}
      </Modal>
    </div>
  );
}
