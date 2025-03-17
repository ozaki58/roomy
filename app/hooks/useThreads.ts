import React, { useState, useCallback, useEffect } from 'react';
import { Thread } from '@/components/types';
// スレッドの型定義

import { createClient } from '../utils/supabase/client';
  import { UserProfile } from '@/components/types';
export const useThreads = (groupId?: string, userProfile?: UserProfile | null) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  const [likedThreadIds, setLikedThreadIds] = useState<Set<string>>(new Set());
  const [favoritedThreadIds, setFavoritedThreadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // スレッドの読み込み - キャッシュなしバージョン
  const fetchThreads = useCallback(async () => {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!groupId) return;
    
    setLoading(true);
    try {
      // キャッシュチェックを削除
      const response = await fetch(`/api/threads?groupId=${groupId}`);
      if (!response.ok) throw new Error("スレッド取得に失敗しました");
      
      const data = await response.json();
      setThreads(data.threads || []);
      
    
      
      // いいねとお気に入りのステータスを取得
      if (session) {
        await fetchLikesForThreads(data.threads);
        await fetchFavoritesForThreads(data.threads);
      }
      
    } catch (error) {
      console.error("スレッド取得エラー:", error);
      setError("スレッドの読み込み中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [groupId]);
  
  // いいねステータスの取得
  const fetchLikesForThreads = useCallback(async (threadsToCheck?: Thread[]) => {
    try {
      const threadsArray = threadsToCheck || threads;
      if (!threadsArray.length) return;
      
      const threadIds = threadsArray.map(thread => thread.id);
      console.log("いいね状態取得リクエスト:", threadIds);
      
      const response = await fetch(`/api/user/likes-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadIds }),
      });
      
      if (!response.ok) {
        throw new Error("いいねステータスの取得に失敗しました");
      }
      
      const data = await response.json();
      console.log("いいね状態レスポンス:", data);
      
      if (Array.isArray(data.likedThreadIds)) {
        setLikedThreadIds(new Set(data.likedThreadIds));
      } else {
        console.error("いいねステータスのレスポンス形式が不正:", data);
      }
    } catch (error) {
      console.error("いいねステータス取得エラー:", error);
    }
  }, [threads]);
  
  // お気に入りステータスの取得
  const fetchFavoritesForThreads = useCallback(async (threadsToCheck?: Thread[]) => {
    try {
      const threadsArray = threadsToCheck || threads;
      if (!threadsArray.length) return;
      
      const threadIds = threadsArray.map(thread => thread.id);
      console.log("お気に入り状態取得リクエスト:", threadIds);
      
      const response = await fetch(`/api/user/favorites-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadIds }),
      });
      
      if (!response.ok) {
        throw new Error("お気に入りステータスの取得に失敗しました");
      }
      
      const data = await response.json();
      console.log("お気に入り状態レスポンス:", data);
      
      if (Array.isArray(data.favoritedThreadIds)) {
        setFavoritedThreadIds(new Set(data.favoritedThreadIds));
      } else {
        console.error("お気に入りステータスのレスポンス形式が不正:", data);
      }
    } catch (error) {
      console.error("お気に入りステータス取得エラー:", error);
    }
  }, [threads]);

  // 単一スレッドのいいねステータスを更新
  const updateThreadLikeStatus = useCallback(async (threadId: string, isLiked: boolean) => {
    console.log(`useThreads: いいね状態更新 - スレッド ${threadId}:`, { 新状態: isLiked });
    try {
      // いいね状態のセットを更新
      setLikedThreadIds(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(threadId);
        } else {
          newSet.delete(threadId);
        }
        return newSet;
      });
      
      // 対象スレッドのいいね数のみ更新
      setThreads(prev => 
        prev.map(thread => {
          if (thread.id === threadId) {
            const newLikesCount = isLiked 
              ? (thread.likes_count || 0) + 1 
              : Math.max((thread.likes_count || 0) - 1, 0);
            return { ...thread, likes_count: newLikesCount };
          }
          return thread;
        })
      );
      

      
      console.log(`useThreads: いいね状態更新完了 - スレッド ${threadId}`);
    } catch (error) {
      console.error(`useThreads: いいね状態更新エラー - スレッド ${threadId}:`, error);
    }
  }, []);

  // 単一スレッドのお気に入りステータスを更新
  const updateThreadFavoriteStatus = useCallback(async (threadId: string, isFavorited: boolean) => {
    console.log(`useThreads: お気に入り状態更新 - スレッド ${threadId}:`, { 新状態: isFavorited });
    try {
      // お気に入り状態のセットを更新
      setFavoritedThreadIds(prev => {
        const newSet = new Set(prev);
        if (isFavorited) {
          newSet.add(threadId);
        } else {
          newSet.delete(threadId);
        }
        return newSet;
      });
      
      console.log(`useThreads: お気に入り状態更新完了 - スレッド ${threadId}`);
    } catch (error) {
      console.error(`useThreads: お気に入り状態更新エラー - スレッド ${threadId}:`, error);
    }
  }, []);
  
  // ファボ済みスレッドのフィルタリング
  const getFavoritedThreads = useCallback(() => {
    return threads.filter(thread => favoritedThreadIds.has(thread.id));
  }, [threads, favoritedThreadIds]);
  
  // スレッドのいいね状態の確認
  const isThreadLiked = useCallback((threadId: string): boolean => {
    return likedThreadIds.has(threadId);
  }, [likedThreadIds]);
  
  // スレッドのお気に入り状態の確認
  const isThreadFavorited = useCallback((threadId: string): boolean => {
    return favoritedThreadIds.has(threadId);
  }, [favoritedThreadIds]);
  
  // スレッド削除
  const deleteThread = useCallback(async (threadId: string) => {
    try {
      // 削除前の状態を保存（ロールバック用）
      const previousThreads = [...threads];
      
      // 楽観的に状態を更新
      setThreads(prev => prev.filter(thread => thread.id !== threadId));
      console.log("スレッド削除成功");
      // API呼び出し
      const response = await fetch(`/api/threads/${threadId}`, { method: "DELETE" });
      
      if (!response.ok) {
        //失敗した場合はロールバック
        setThreads(previousThreads);
        throw new Error("スレッド削除に失敗しました");
      }
      
      // 成功した場合、何もしない
      return true;
    } catch (error) {
      console.error("スレッド削除エラー:", error);
      return false;
    }
  }, [threads]);


  const createThread = useCallback(async (content: string) => {
    try {
      const tempId = `temp-${Date.now()}`;
      
   
      const optimisticThread = {
        id: tempId,
        group_id: groupId || '',
        content,
        comments_count: 0,
        created_at: new Date().toISOString(),
        user: userProfile ? 
          {...userProfile, username: userProfile.username || 'ユーザー'} : 
          { id: '', username: 'ユーザー', image_url: '' },
        comments: []
      } as Thread;  // Thread型としてアサーション
      
   
      setThreads(prev => [optimisticThread, ...prev]);
      
     
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          content,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // 失敗した場合は楽観的に追加したスレッドを削除（ロールバック）
        setThreads(prev => prev.filter(thread => thread.id !== tempId));
        throw new Error(errorData.error || "スレッド作成に失敗しました");
      }
      
      // 4. 成功した場合: APIからの応答で仮のスレッドを更新
      const result = await response.json();
      setThreads(prev => 
        prev.map(thread => thread.id === tempId ? result[0] : thread)
      );
      
      return true;
    } catch (error) {
      console.error("スレッド作成エラー:", error);
      return false;
    }
  }, [groupId, userProfile]);


  
  // 初回読み込み
  useEffect(() => {
    if (groupId) {
      fetchThreads();
    }
  }, [groupId, fetchThreads]);
  
  return {
    threads,
    setThreads,
    loading,
    error,
    fetchThreads,
    isThreadLiked,
    isThreadFavorited,
    fetchLikesForThreads,
    fetchFavoritesForThreads,
    getFavoritedThreads,
    updateThreadLikeStatus,
    updateThreadFavoriteStatus,
    deleteThread,
    createThread
  };
}; 