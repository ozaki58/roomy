"use client";
import React, { useEffect, useState, useCallback } from "react";
import ThreadListPresentation from "./threadListPresentation";
import { Thread, UserProfile } from "@/components/types";
import { useThreadActions } from "@/app/hooks/useThreadActions";
import { useCommentActions } from "@/app/hooks/useCommentActions";
import ErrorBoundary from "./errorBoundary";
import { ThreadLoadingError } from "./error";
import { useThreads } from "@/app/hooks/useThreads";
import { set } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/app/utils/supabase/client";

interface ThreadListContainerProps {
    threads?: Thread[];
    userId: string;
    groupId: string;
    unAuthenticated_toast: () => void;
    isThreadLiked: (threadId: string) => boolean;
    isThreadFavorited: (threadId: string) => boolean;
    onLikeToggled?: (threadId: string, isLiked: boolean) => void;
    onFavoriteToggled?: (threadId: string, isFavorited: boolean) => void;
    onCommentAdded?: (threadId: string, updatedThread: Thread) => void;
    onThreadDeleted: (threadId: string) => void;
    userProfile: UserProfile;
  }

export default function ThreadListContainer({ 
  threads: initialThreads = [], 
  userId,
  userProfile,
  onThreadDeleted,
  unAuthenticated_toast,
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
  const { toast } = useToast();

  useEffect(() => {
    // 初回マウント時または実質的な変更がある場合のみ更新
    if (!threads.length || JSON.stringify(initialThreads) !== JSON.stringify(threads)) {
      setThreads(initialThreads || []);
    }
  }, [initialThreads, threads]);

  const closeModal = () => {
    setIsModalOpen(false);
    // 親コンポーネントにも非同期で通知（全体更新用）
 
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
    unAuthenticated_toast();
    
    try {
      // 楽観的に選択中のスレッドのコメント数を増やす
      setThreads(prevThreads => {
        return prevThreads.map(thread => {
          if (thread.id === selectedThread.id) {
            const updatedThread = { 
              ...thread, 
              comments_count: (thread.comments_count || 0) + 1 
            };
            return updatedThread;
          }
          return thread;
        });
      });
      
      //モーダル内のスレッドも楽観的に更新
      if (selectedThread) {
        const tempCommentId = `temp-${Date.now()}`;
        
        // 仮のコメントオブジェクト - userProfileを使用
        const optimisticComment = {
          id: tempCommentId,
          thread_id: selectedThread.id,
          content: content,
          created_at: new Date().toISOString(),
          user: userProfile || { id: userId, username: 'ユーザー', image_url: '' }
        };
        
        // モーダル内のスレッドの選択状態を更新
        setSelectedThread(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            comments_count: (prev.comments_count || 0) + 1,
            comments: [...(prev.comments || []), optimisticComment]
          };
        });
      }
      
      // API呼び出し
      const result = await createComment(content, userId);
      
      //API成功時: アップデートされたスレッドデータを取得して状態を更新
      const updatedThread = await fetchThreadById(selectedThread.id);
      setSelectedThread(updatedThread);
      
      
      if (onCommentAdded) {
        onCommentAdded(selectedThread.id,updatedThread);
      }
      
    } catch (error) {
      console.error("コメント投稿エラー:", error);
      
      // ロールバック処理: 楽観的に増やしたコメント数を元に戻す
      setThreads(prevThreads => {
        return prevThreads.map(thread => {
          if (thread.id === selectedThread.id) {
            return { 
              ...thread, 
              comments_count: Math.max((thread.comments_count || 0) - 1, 0) 
            };
          }
          return thread;
        });
      });
      
      setSelectedThread(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments_count: Math.max((prev.comments_count || 0) - 1, 0),
          comments: prev.comments?.slice(0, -1) || []
        };
      });
      
      // エラーを表示
      toast({
        title: "エラー",
        description: "コメントの投稿に失敗しました",
        variant: "destructive",
      });
    }
  }, [selectedThread, createComment, userId, userProfile, onCommentAdded, fetchThreadById]);

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
       unAuthenticated_toast={unAuthenticated_toast}
       onCommentDeleted={handleCommentDeleted}
       onThreadDeleted={onThreadDeleted}
       onLikeToggled={handleLikeToggled}
       onFavoriteToggled={handleFavoriteToggled}
    />
    </ErrorBoundary>
  );
}