import { useCallback, useRef } from 'react';
import { Comment } from '@/components/types';


const CACHE_TTL = 30000; // 30秒

export function useCommentActions(threadId?: string) {
  // リクエストキャッシュの参照
  const commentCache = useRef<Record<string, { data: any, timestamp: number }>>({});
  
  // キャッシュからデータを取得する関数
  const getFromCache = useCallback((key: string) => {
    const cachedItem = commentCache.current[key];
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_TTL) {
      console.log(`コメント: キャッシュヒット: ${key}`);
      return cachedItem.data;
    }
    return null;
  }, []);
  
  // キャッシュにデータを保存する関数
  const saveToCache = useCallback((key: string, data: any) => {
    commentCache.current[key] = {
      data,
      timestamp: Date.now()
    };
    console.log(`コメント: キャッシュ保存: ${key}`);
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      
      const response = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("コメント削除に失敗しました");
      
      // 関連するキャッシュを無効化
      if (threadId) {
        Object.keys(commentCache.current).forEach(key => {
          if (key.includes(threadId)) {
            delete commentCache.current[key];
          }
        });
      }
      
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
      
   
      if (threadId) {
        Object.keys(commentCache.current).forEach(key => {
          if (key.includes(threadId)) {
            delete commentCache.current[key];
          }
        });
      }
      
      return await response.json();
    } catch (error) {
      console.error("コメント作成エラー:", error);
      throw error;
    }
  }, [threadId]);
  
  // コメント取得（キャッシュ対応）
  const fetchComments = useCallback(async (forceRefresh = false) => {
    if (!threadId) return [];
    
    const cacheKey = `comments_${threadId}`;
    
    // 強制リフレッシュでなければキャッシュをチェック
    if (!forceRefresh) {
      const cachedComments = getFromCache(cacheKey);
      if (cachedComments) {
        return cachedComments;
      }
    }
    
    try {
      const response = await fetch(`/api/threads/${threadId}/comments`);
      if (!response.ok) throw new Error("コメント取得に失敗しました");
      
      const data = await response.json();
      const comments = data.comments || [];
      
      // キャッシュに保存
      saveToCache(cacheKey, comments);
      
      return comments;
    } catch (error) {
      console.error("コメント取得エラー:", error);
      return [];
    }
  }, [threadId, getFromCache, saveToCache]);
  
  // キャッシュクリア関数
  const clearCache = useCallback(() => {
    commentCache.current = {};
    console.log("コメントキャッシュを全てクリアしました");
  }, []);
  
  return {
    deleteComment,
    createComment,
    fetchComments,
    clearCache
  };
}