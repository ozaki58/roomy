// hooks/useComments.ts
import { useCallback } from 'react';
import { Thread, Comment } from '@/components/types';

export function useComments(threadId: string, updateThread: (thread: Thread) => void) {
  // コメント作成
  const createComment = useCallback(async (content: string, userId: string) => {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          content,
          createdBy: userId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "コメント作成に失敗しました");
      }
      
      // 更新されたスレッドを取得
      const threadResponse = await fetch(`/api/threads/${threadId}`);
      if (!threadResponse.ok) throw new Error("スレッド情報の取得に失敗しました");
      
      const data = await threadResponse.json();
      return true;
    } catch (error) {
      console.error("コメント作成エラー:", error);
      return false;
    }
  }, [threadId]);

  // コメント削除
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, { 
        method: "DELETE" 
      });
      
      if (!response.ok) throw new Error("コメント削除に失敗しました");
      
      // 更新されたスレッドを取得
      const threadResponse = await fetch(`/api/threads/${threadId}`);
      if (!threadResponse.ok) throw new Error("スレッド情報の取得に失敗しました");
      
      const data = await threadResponse.json();
      return true;
    } catch (error) {
      console.error("コメント削除エラー:", error);
      return false;
    }
  }, [threadId]);

  return {
    createComment,
    deleteComment
  };
}