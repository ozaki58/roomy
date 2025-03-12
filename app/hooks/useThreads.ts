import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Thread } from '@/components/types';
// スレッドの型定義

// キャッシュデータの型定義
interface ThreadsCache {
  threads?: Thread[];
  popularThreads?: Thread[];
  likedThreadIds?: string[];
  favoritedThreadIds?: string[];
  timestamp: number;
  [key: string]: any; // 動的キーへのアクセスを許可
}



const CACHE_TTL = 30000; // 30秒

// 進行中のリクエストを追跡
const pendingRequests: Record<string, Promise<any>> = {};

export const useThreads = (groupId?: string) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [popularThreads, setPopularThreads] = useState<Thread[]>([]);
  const [likedThreadIds, setLikedThreadIds] = useState<Set<string>>(new Set());
  const [favoritedThreadIds, setFavoritedThreadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // キャッシュを保持するRef
  const cacheRef = useRef<Record<string, ThreadsCache>>({});
  
  // キャッシュからデータを取得する関数
  const getFromCache = useCallback((key: string): ThreadsCache | null => {
    const cachedData = cacheRef.current[key];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log(`キャッシュヒット: ${key}`);
      return cachedData;
    }
    return null;
  }, []);
  
  // キャッシュにデータを保存する関数
  const saveToCache = useCallback((key: string, data: Partial<ThreadsCache>) => {
    cacheRef.current[key] = {
      ...data,
      timestamp: Date.now()
    };
    console.log(`キャッシュ保存: ${key}`);
  }, []);
  
  // いいねとお気に入りのバッチ取得
  const fetchBatchStatus = async (endpoint: string, threadIds: string[], cachePrefix: string): Promise<string[]> => {
    if (!threadIds.length) return [];
    
    const cacheKey = `${cachePrefix}_${threadIds.sort().join('_')}`;
    
    // キャッシュを確認
    const cachedData = getFromCache(cacheKey);
    const cacheDataKey = `${cachePrefix}ThreadIds`;
    if (cachedData && cachedData[cacheDataKey]) {
      return cachedData[cacheDataKey] as string[];
    }
    
    try {
      console.log(`${cachePrefix}状態取得リクエスト:`, threadIds);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadIds }),
      });
      
      if (!response.ok) {
        throw new Error(`${cachePrefix}ステータスの取得に失敗しました`);
      }
      
      const data = await response.json();
      console.log(`${cachePrefix}状態レスポンス:`, data);
      
      // 応答形式によってキー名を調整
      const resultKey = cachePrefix === 'likes' ? 'likedThreadIds' : 'favoritedThreadIds';
      const resultIds = data[resultKey] || [];
      
      if (Array.isArray(resultIds)) {
        // キャッシュに保存
        const cacheData: Partial<ThreadsCache> = {};
        cacheData[cacheDataKey] = resultIds;
        saveToCache(cacheKey, cacheData);
        
        return resultIds;
      } else {
        console.error(`${cachePrefix}ステータスのレスポンス形式が不正:`, data);
        return [];
      }
    } catch (error) {
      console.error(`${cachePrefix}ステータス取得エラー:`, error);
      return [];
    }
  };
  
  // いいねステータスの取得
  const fetchLikesForThreads = useCallback(async (threadsToCheck?: Thread[]): Promise<Set<string>> => {
    try {
      const threadsArray = threadsToCheck || threads;
      if (!threadsArray.length) return new Set<string>();
      
      const threadIds = threadsArray.map(thread => thread.id);
      const likedIds = await fetchBatchStatus('/api/user/likes-batch', threadIds, 'likes');
      
      const likedSet = new Set<string>(likedIds);
      setLikedThreadIds(likedSet);
      return likedSet;
    } catch (error) {
      console.error("いいねステータス取得エラー:", error);
      return new Set<string>();
    }
  }, [threads]);
  
  // お気に入りステータスの取得
  const fetchFavoritesForThreads = useCallback(async (threadsToCheck?: Thread[]): Promise<Set<string>> => {
    try {
      const threadsArray = threadsToCheck || threads;
      if (!threadsArray.length) return new Set<string>();
      
      const threadIds = threadsArray.map(thread => thread.id);
      const favoritedIds = await fetchBatchStatus('/api/user/favorites-batch', threadIds, 'favorite');
      
      const favoritedSet = new Set<string>(favoritedIds);
      setFavoritedThreadIds(favoritedSet);
      return favoritedSet;
    } catch (error) {
      console.error("お気に入りステータス取得エラー:", error);
      return new Set<string>();
    }
  }, [threads]);
  
  // スレッドの読み込み
  const fetchThreads = useCallback(async (forceRefresh = false) => {
    if (!groupId) return;
    
    const cacheKey = `threads_${groupId}`;
    
    // 強制リフレッシュでなければキャッシュを確認
    if (!forceRefresh) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        if (cachedData.threads) setThreads(cachedData.threads);
        if (cachedData.popularThreads) setPopularThreads(cachedData.popularThreads);
        if (cachedData.likedThreadIds) setLikedThreadIds(new Set<string>(cachedData.likedThreadIds));
        if (cachedData.favoritedThreadIds) setFavoritedThreadIds(new Set<string>(cachedData.favoritedThreadIds));
        setLoading(false);
        return;
      }
    }
    
    // 同じリクエストが進行中なら再利用
    if (cacheKey in pendingRequests && !forceRefresh) {
      console.log(`既存リクエスト再利用: ${cacheKey}`);
      await pendingRequests[cacheKey];
      return;
    }
    
    setLoading(true);
    
    const requestPromise = (async () => {
      try {
        const response = await fetch(`/api/threads?groupId=${groupId}`);
        if (!response.ok) throw new Error("スレッド取得に失敗しました");
        
        const data = await response.json();
        const threadsData = data.threads || [];
        setThreads(threadsData);
        
        // 人気スレッドも取得
        const popularResponse = await fetch(`/api/groups/${groupId}/threads/popular`);
        let popularData: Thread[] = [];
        
        if (popularResponse.ok) {
          const popularJson = await popularResponse.json();
          popularData = popularJson.threads || [];
          setPopularThreads(popularData);
        }
        
     
        const threadIds = threadsData.map((thread: Thread) => thread.id);
        const likeIds = await fetchBatchStatus('/api/user/likes-batch', threadIds, 'likes');
        const favoriteIds = await fetchBatchStatus('/api/user/favorites-batch', threadIds, 'favorite');
        
        setLikedThreadIds(new Set<string>(likeIds));
        setFavoritedThreadIds(new Set<string>(favoriteIds));
        
    
        saveToCache(cacheKey, {
          threads: threadsData,
          popularThreads: popularData,
          likedThreadIds: likeIds,
          favoritedThreadIds: favoriteIds
        });
        
      } catch (error) {
        console.error("スレッド取得エラー:", error);
        setError("スレッドの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
        delete pendingRequests[cacheKey];
      }
    })();
    
    pendingRequests[cacheKey] = requestPromise;
    return requestPromise;
  }, [groupId, getFromCache, saveToCache]);

  // 単一スレッドのいいねステータスを更新
  const updateThreadLikeStatus = useCallback(async (threadId: string, isLiked: boolean) => {
    console.log(`useThreads: いいね状態更新 - スレッド ${threadId}:`, { 新状態: isLiked });
    try {
   
      setLikedThreadIds(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(threadId);
        } else {
          newSet.delete(threadId);
        }
        return newSet;
      });
      
    
      setThreads(prev => 
        prev.map((thread: Thread) => {
          if (thread.id === threadId) {
            const newLikesCount = isLiked 
              ? (thread.likes_count || 0) + 1 
              : Math.max((thread.likes_count || 0) - 1, 0);
            return { ...thread, likes_count: newLikesCount };
          }
          return thread;
        })
      );
      
      // 人気スレッドでも対象スレッドのいいね数のみ更新
      setPopularThreads(prev => 
        prev.map((thread: Thread) => {
          if (thread.id === threadId) {
            const newLikesCount = isLiked 
              ? (thread.likes_count || 0) + 1 
              : Math.max((thread.likes_count || 0) - 1, 0);
            return { ...thread, likes_count: newLikesCount };
          }
          return thread;
        })
      );
      
      // いいね関連のキャッシュを無効化
      Object.keys(cacheRef.current).forEach(key => {
        if (key.startsWith('likes_')) {
          delete cacheRef.current[key];
        }
      });
      
      console.log(`useThreads: いいね状態更新完了 - スレッド ${threadId}`);
    } catch (error) {
      console.error(`useThreads: いいね状態更新エラー - スレッド ${threadId}:`, error);
    }
  }, []);

  // 単一スレッドのお気に入りステータスを更新
  const updateThreadFavoriteStatus = useCallback(async (threadId: string, isFavorited: boolean) => {
    console.log(`useThreads: お気に入り状態更新 - スレッド ${threadId}:`, { 新状態: isFavorited });
    try {
     
      setFavoritedThreadIds(prev => {
        const newSet = new Set(prev);
        if (isFavorited) {
          newSet.add(threadId);
        } else {
          newSet.delete(threadId);
        }
        return newSet;
      });
      
      // お気に入り関連のキャッシュを無効化
      Object.keys(cacheRef.current).forEach(key => {
        if (key.startsWith('favorite_')) {
          delete cacheRef.current[key];
        }
      });
      
      console.log(`useThreads: お気に入り状態更新完了 - スレッド ${threadId}`);
    } catch (error) {
      console.error(`useThreads: お気に入り状態更新エラー - スレッド ${threadId}:`, error);
    }
  }, []);
  

  const getFavoritedThreads = useCallback(() => {
    return threads.filter(thread => favoritedThreadIds.has(thread.id));
  }, [threads, favoritedThreadIds]);
  

  const isThreadLiked = useCallback((threadId: string): boolean => {
    return likedThreadIds.has(threadId);
  }, [likedThreadIds]);
  

  const isThreadFavorited = useCallback((threadId: string): boolean => {
    return favoritedThreadIds.has(threadId);
  }, [favoritedThreadIds]);
  
  
  const deleteThread = useCallback(async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("スレッド削除に失敗しました");
      
     
      if (groupId) {
        const groupCacheKey = `threads_${groupId}`;
        delete cacheRef.current[groupCacheKey];
      }
      
      await fetchThreads(true); // 強制リフレッシュ
      return true;
    } catch (error) {
      console.error("スレッド削除エラー:", error);
      return false;
    }
  }, [fetchThreads, groupId]);

  // スレッド作成
  const createThread = useCallback(async (content: string) => {
    try {
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
        throw new Error(errorData.error || "スレッド作成に失敗しました");
      }
      
      // このグループに関連するキャッシュを無効化
      if (groupId) {
        const groupCacheKey = `threads_${groupId}`;
        delete cacheRef.current[groupCacheKey];
      }
      
      await fetchThreads(true); // 強制リフレッシュ
      return true;
    } catch (error) {
      console.error("スレッド作成エラー:", error);
      return false;
    }
  }, [groupId, fetchThreads]);
  
  // キャッシュをクリアする関数
  const clearCache = useCallback(() => {
    cacheRef.current = {};
    console.log("キャッシュをクリアしました");
  }, []);
  
  // 初回読み込み
  useEffect(() => {
    if (groupId) {
      fetchThreads();
    }
    
    // コンポーネントのアンマウント時にこのグループに関連するキャッシュを削除
    return () => {
      if (groupId) {
        Object.keys(cacheRef.current).forEach(key => {
          if (key.includes(groupId)) {
            delete cacheRef.current[key];
          }
        });
      }
    };
  }, [groupId, fetchThreads]);
  
  return {
    threads,
    popularThreads,
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
    createThread,
    clearCache
  };
}; 