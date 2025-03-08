"use client";
import React, { useEffect, useState, useCallback } from "react";
import ThreadCard from "@/components/threadCard";
import Modal from "./modal";
import { TextareaForm } from "./textareaForm";
import { Thread, Comment } from "@/components/types";
import { useThreadActions } from "@/app/hooks/useThreadActions";
import { useCommentActions } from "@/app/hooks/useCommentActions";

interface ThreadListProps {
  threads?: Thread[];
  userId: string;
  groupId?: string;
}

export default function ThreadList({ threads: initialThreads = [], userId, groupId }: ThreadListProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { fetchThreadById } = useThreadActions();
  const { createComment } = useCommentActions(selectedThread?.id);

  useEffect(() => {
    setThreads(initialThreads || []);
  }, [initialThreads]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedThread(null);
  };

  const handleCommentClick = useCallback((thread: Thread) => {
    setSelectedThread(thread);
    setIsModalOpen(true);
  }, []);

  // スレッドの再取得
  const refetchThread = useCallback(async (threadId: string) => {
    if (!threadId) return;
    
    try {
      const updatedThread = await fetchThreadById(threadId);
      
      // 選択されたスレッドを更新
      if (selectedThread && selectedThread.id === threadId) {
        setSelectedThread(updatedThread);
      }
      
      // リスト内のスレッドを更新
      setThreads(prevThreads =>
        prevThreads.map(thread => (thread.id === threadId ? updatedThread : thread))
      );
    } catch (error) {
      console.error("スレッド再取得エラー:", error);
    }
  }, [fetchThreadById, selectedThread]);

  // コメント投稿処理
  const handleAddComment = useCallback(async (content: string) => {
    if (!selectedThread) return;
    
    try {
      await createComment(content, userId);
      await refetchThread(selectedThread.id);
    } catch (error) {
      console.error("コメント投稿エラー:", error);
    }
  }, [selectedThread, createComment, userId, refetchThread]);

  // コメント削除後の処理
  const handleCommentDeleted = useCallback(async (commentId: string) => {
    if (!selectedThread) return;
    await refetchThread(selectedThread.id);
  }, [selectedThread, refetchThread]);

  // スレッド削除後の処理
  const handleThreadDeleted = useCallback((threadId: string) => {
    setThreads(prevThreads => prevThreads.filter(thread => thread.id !== threadId));
    
    // モーダルで表示中のスレッドが削除された場合はモーダルを閉じる
    if (selectedThread && selectedThread.id === threadId) {
      closeModal();
    }
  }, [selectedThread]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {threads.map((thread, index) => (
            <div key={thread.id || index} className="mb-0">
              <ThreadCard
                thread={{ ...thread, comments: (thread.comments || []).slice(0, 2) }}
                onCommentClick={() => handleCommentClick(thread)}
                userId={userId}
                onThreadDeleted={handleThreadDeleted}
              />
            </div>
          ))}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        {selectedThread && (
          <div>
            <h2 className="text-xl font-semibold mb-4">返信スレッド</h2>
            <ThreadCard 
              thread={selectedThread} 
              userId={userId} 
              onCommentDeleted={handleCommentDeleted}
              onThreadDeleted={handleThreadDeleted}
            />
            <TextareaForm 
              threadId={selectedThread.id} 
              userId={userId}
              onCommentSubmit={handleAddComment}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}