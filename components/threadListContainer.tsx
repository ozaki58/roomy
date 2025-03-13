"use client";
import React, { useEffect, useState, useCallback } from "react";
import ThreadListPresentation from "./threadListPresentation";
import { Thread } from "@/components/types";
import { useThreadActions } from "@/app/hooks/useThreadActions";
import { useCommentActions } from "@/app/hooks/useCommentActions";
import ErrorBoundary from "./errorBoundary";
import { ThreadLoadingError } from "./error";
import { useThreads } from "@/app/hooks/useThreads";
import { set } from "react-hook-form";
interface ThreadListContainerProps {
    threads?: Thread[];
    userId: string;
    groupId: string;
    isThreadLiked: (threadId: string) => boolean;
    isThreadFavorited: (threadId: string) => boolean;
    onLikeToggled?: (threadId: string, isLiked: boolean) => void;
    onFavoriteToggled?: (threadId: string, isFavorited: boolean) => void;
    onCommentAdded?: (threadId: string) => void;
  }

export default function ThreadListContainer({ 
  threads: initialThreads = [], 
  userId,

  groupId,
  isThreadLiked, 
  isThreadFavorited,
  onLikeToggled,
  onFavoriteToggled,
  onCommentAdded
}: ThreadListContainerProps) {
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
    // 親コンポーネントにも非同期で通知（全体更新用）
    if (onCommentAdded) {
      // setTimeout でバックグラウンド実行にする
      onCommentAdded(selectedThread?.id || "");
    }
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
      console.log("スレッド再取得中:", threadId);
      const updatedThread = await fetchThreadById(threadId);
      
      // 選択されたスレッドを更新
      if (selectedThread && selectedThread.id === threadId) {
        console.log("スレッド更新中:", updatedThread);
        setSelectedThread(updatedThread);
      }
      
      // リスト内のスレッドを更新
      setThreads(prevThreads => {
        console.log("スレッドリスト更新中:", prevThreads.map(thread => thread.id));
        return prevThreads.map(thread => (thread.id === threadId ? updatedThread : thread));
      });
    } catch (error) {
      console.error("スレッド再取得エラー:", error);
    }
  }, [fetchThreadById, selectedThread]);

  // コメント投稿処理
  const handleAddComment = useCallback(async (content: string) => {
    if (!selectedThread) return;
    
    try {
      console.log("コメント投稿中:", selectedThread.id);
      await createComment(content, userId);
      
      // まず選択中のスレッドのみを更新
      const updatedThread = await fetchThreadById(selectedThread.id);
      setSelectedThread(updatedThread);
      
      // リスト内の当該スレッドだけを更新
      setThreads(prevThreads => 
        prevThreads.map(thread => thread.id === selectedThread.id ? updatedThread : thread)
      );
      
      
    } catch (error) {
      console.error("コメント投稿エラー:", error);
    }
  }, [selectedThread, createComment, userId, onCommentAdded, fetchThreadById]);

  // コメント削除でも同様の修正
  const handleCommentDeleted = useCallback(async (commentId: string) => {
    if (!selectedThread) return;
    
    try {
      // まず選択中のスレッドのみを更新
      const updatedThread = await fetchThreadById(selectedThread.id);
      setSelectedThread(updatedThread);
      
      // リスト内の当該スレッドだけを更新
      setThreads(prevThreads => 
        prevThreads.map(thread => thread.id === selectedThread.id ? updatedThread : thread)
      );
      
      
    } catch (error) {
      console.error("コメント削除後の更新エラー:", error);
    }
  }, [selectedThread, fetchThreadById, onCommentAdded]);

  // スレッド削除後の処理
  const handleThreadDeleted = useCallback((threadId: string) => {
    setThreads(prevThreads => prevThreads.filter(thread => thread.id !== threadId));
    
    // モーダルで表示中のスレッドが削除された場合はモーダルを閉じる
    if (selectedThread && selectedThread.id === threadId) {
      closeModal();
    }
  }, [selectedThread]);

  // いいねとお気に入りのコールバック
  const handleLikeToggled = useCallback((threadId: string, isLiked: boolean) => {
    console.log(`ThreadListContainer: いいねコールバック - スレッド ${threadId}:`, { 新状態: isLiked });
    
    if (onLikeToggled) {
      onLikeToggled(threadId, isLiked);
    }
  }, [onLikeToggled]);
  
  const handleFavoriteToggled = useCallback((threadId: string, isFavorited: boolean) => {
    console.log(`ThreadListContainer: お気に入りコールバック - スレッド ${threadId}:`, { 新状態: isFavorited });
    
    if (onFavoriteToggled) {
      onFavoriteToggled(threadId, isFavorited);
    }
  }, [onFavoriteToggled]);

  return (
  <ErrorBoundary fallback={<ThreadLoadingError onRetry={() => setThreads(initialThreads)} />}>
     <ThreadListPresentation
       threads={threads}
       userId={userId}
       isThreadLiked={isThreadLiked}
       isThreadFavorited={isThreadFavorited}
       selectedThread={selectedThread}
       isModalOpen={isModalOpen}
       onCloseModal={closeModal}
       onCommentClick={handleCommentClick}
       onAddComment={handleAddComment}
       onCommentDeleted={handleCommentDeleted}
       onThreadDeleted={handleThreadDeleted}
       onLikeToggled={handleLikeToggled}
       onFavoriteToggled={handleFavoriteToggled}
    />
    </ErrorBoundary>
  );
}