import { useCallback } from 'react';
import { Comment } from '@/components/types';

export function useCommentActions(threadId?: string) {
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("コメント削除に失敗しました");
      return await response.json();
    } catch (error) {
      console.error("コメント削除エラー:", error);
      throw error;
    }
  }, []);

  const createComment = useCallback(async (content: string, userId: string) => {
    if (!threadId) throw new Error("スレッドIDが指定されていません");
    
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
      
      return await response.json();
    } catch (error) {
      console.error("コメント作成エラー:", error);
      throw error;
    }
  }, [threadId]);
  
  return {
    deleteComment,
    createComment
  };
}