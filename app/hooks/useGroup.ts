// hooks/useGroup.ts
import { useState, useCallback, useEffect } from 'react';

export function useGroup(groupId: string, userId: string | null) {
  const [groupName, setGroupName] = useState<string>("");
  const [isMember, setIsMember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // グループ詳細情報の取得
  const fetchGroupDetail = useCallback(async () => {
    if (!groupId) return;
    
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) throw new Error("グループ情報の取得に失敗しました");
      
      const data = await response.json();
      setGroupName(data.group.name);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("不明なエラー"));
      console.error("グループ詳細取得エラー:", err);
    }
  }, [groupId]);

  // メンバーシップ状態の取得
  const fetchMembershipStatus = useCallback(async () => {
    if (!groupId || !userId) return;
    
    try {
      const response = await fetch(`/api/groups/join/?userId=${userId}&groupId=${groupId}`);
      if (!response.ok) throw new Error("メンバーシップ状態の取得に失敗しました");
      
      const data = await response.json();
      setIsMember(data.isMember);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("不明なエラー"));
      console.error("メンバーシップ状態取得エラー:", err);
    } finally {
      setLoading(false);
    }
  }, [groupId, userId]);

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
      
      setIsMember(false);
      return true;
    } catch (error) {
      console.error("グループ脱退エラー:", error);
      return false;
    }
  }, [groupId, userId]);

  // 初回レンダリング時に情報取得
  useEffect(() => {
    if (groupId) {
      fetchGroupDetail();
    }
    if (groupId && userId) {
      fetchMembershipStatus();
    }
  }, [groupId, userId, fetchGroupDetail, fetchMembershipStatus]);

  return {
    groupName,
    isMember,
    loading,
    error,
    joinGroup,
    leaveGroup
  };
}