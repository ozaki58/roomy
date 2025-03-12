// hooks/useGroup.ts
import { useState, useCallback, useEffect, useRef } from 'react';


const CACHE_TTL = 60000; // 60秒

export function useGroup(groupId: string, userId: string | null) {
  const [groupName, setGroupName] = useState<string>("");
  const [group_image, setGroupImage] = useState<string>("");
  const [isMember, setIsMember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // キャッシュを保持するRef
  const groupCache = useRef<Record<string, { data: any, timestamp: number }>>({});
  
  // キャッシュからデータを取得する関数
  const getFromCache = useCallback((key: string) => {
    const cachedItem = groupCache.current[key];
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_TTL) {
      console.log(`グループ: キャッシュヒット: ${key}`);
      return cachedItem.data;
    }
    return null;
  }, []);
  
  // キャッシュにデータを保存する関数
  const saveToCache = useCallback((key: string, data: any) => {
    groupCache.current[key] = {
      data,
      timestamp: Date.now()
    };
    console.log(`グループ: キャッシュ保存: ${key}`);
  }, []);

  // グループ詳細情報の取得
  const fetchGroupDetail = useCallback(async (forceRefresh = false) => {
    if (!groupId) return;
    
    const cacheKey = `group_detail_${groupId}`;
    
    // 強制リフレッシュでなければキャッシュをチェック
    if (!forceRefresh) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setGroupName(cachedData.group.name);
        setGroupImage(cachedData.group.image_url);
        return cachedData;
      }
    }
    
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) throw new Error("グループ情報の取得に失敗しました");
      
      const data = await response.json();
      setGroupName(data.group.name);
      setGroupImage(data.group.image_url);
      setError(null);
      
      // キャッシュに保存
      saveToCache(cacheKey, data);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("不明なエラー"));
      console.error("グループ詳細取得エラー:", err);
      return null;
    }
  }, [groupId, getFromCache, saveToCache]);

  // メンバーシップ状態の取得
  const fetchMembershipStatus = useCallback(async (forceRefresh = false) => {
    if (!groupId || !userId) return;
    
    const cacheKey = `membership_${userId}_${groupId}`;
    
    // 強制リフレッシュでなければキャッシュをチェック
    if (!forceRefresh) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setIsMember(cachedData.isMember);
        setLoading(false);
        return cachedData;
      }
    }
    
    try {
      const response = await fetch(`/api/groups/join/?userId=${userId}&groupId=${groupId}`);
      if (!response.ok) throw new Error("メンバーシップ状態の取得に失敗しました");
      
      const data = await response.json();
      setIsMember(data.isMember);
      setError(null);
      
      // キャッシュに保存
      saveToCache(cacheKey, data);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("不明なエラー"));
      console.error("メンバーシップ状態取得エラー:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [groupId, userId, getFromCache, saveToCache]);

  // グループへの参加
  const joinGroup = useCallback(async () => {
    if (!groupId || !userId) return false;
    
    try {
      const response = await fetch(`/api/groups/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, groupId }),
      });
      
      if (!response.ok) throw new Error("グループへの参加に失敗しました");
      
      // 関連するキャッシュを無効化
      const membershipCacheKey = `membership_${userId}_${groupId}`;
      delete groupCache.current[membershipCacheKey];
      
      setIsMember(true);
      return true;
    } catch (error) {
      console.error("グループ参加エラー:", error);
      return false;
    }
  }, [groupId, userId]);

  // グループからの脱退
  const leaveGroup = useCallback(async () => {
    if (!groupId || !userId) return false;
    
    try {
      const response = await fetch(`/api/groups/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, groupId }),
      });
      
      if (!response.ok) throw new Error("グループからの脱退に失敗しました");
      
      // 関連するキャッシュを無効化
      const membershipCacheKey = `membership_${userId}_${groupId}`;
      delete groupCache.current[membershipCacheKey];
      
      setIsMember(false);
      return true;
    } catch (error) {
      console.error("グループ脱退エラー:", error);
      return false;
    }
  }, [groupId, userId]);
  
  // キャッシュをクリアする関数
  const clearCache = useCallback(() => {
    groupCache.current = {};
    console.log("グループキャッシュを全てクリアしました");
  }, []);

  // 初回レンダリング時に情報取得
  useEffect(() => {
    if (groupId) {
      fetchGroupDetail();
    }
    if (groupId && userId) {
      fetchMembershipStatus();
    }
    
    // クリーンアップ関数
    return () => {
      // このグループに関連するキャッシュのみをクリア
      Object.keys(groupCache.current).forEach(key => {
        if (key.includes(groupId)) {
          delete groupCache.current[key];
        }
      });
    };
  }, [groupId, userId, fetchGroupDetail, fetchMembershipStatus]);

  return {
    groupName,
    group_image,
    isMember,
    loading,
    error,
    joinGroup,
    leaveGroup,
    refreshGroup: () => {
      fetchGroupDetail(true);
      if (userId) fetchMembershipStatus(true);
    },
    clearCache
  };
}