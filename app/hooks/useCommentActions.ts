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
  }, [threadId]);

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
  
  // コメント取得 - キャッシュなしバージョン
  const fetchComments = useCallback(async () => {
    if (!threadId) return [];
    
    try {
      const response = await fetch(`/api/threads/${threadId}/comments`);
      if (!response.ok) throw new Error("コメント取得に失敗しました");
      
      const data = await response.json();
      return data.comments || [];
    } catch (error) {
      console.error("コメント取得エラー:", error);
      return [];
    }
  }, [threadId]);
  
  return {
    deleteComment,
    createComment,
    fetchComments
  };
}