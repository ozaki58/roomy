// hooks/useThreads.ts
import { useState, useCallback, useEffect } from 'react';
import { Thread } from '@/components/types';

export function useThreads(groupId: string) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // スレッド一覧の取得
  const fetchThreads = useCallback(async () => {
    if (!groupId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/threads?groupId=${groupId}`);
      if (!response.ok) throw new Error("スレッド取得に失敗しました");
      
      const data = await response.json();
      setThreads(data.threads);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("不明なエラー"));
      console.error("スレッド取得エラー:", err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // スレッド削除
  const deleteThread = useCallback(async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("スレッド削除に失敗しました");
      
      await fetchThreads(); // 削除後に再取得
      return true;
    } catch (error) {
      console.error("スレッド削除エラー:", error);
      return false;
    }
  }, [fetchThreads]);

  // スレッド作成
  const createThread = useCallback(async (content: string, userId: string) => {
    try {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          content,
          createdBy: userId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "スレッド作成に失敗しました");
      }
      
      await fetchThreads();
      return true;
    } catch (error) {
      console.error("スレッド作成エラー:", error);
      return false;
    }
  }, [groupId, fetchThreads]);

  // 初回レンダリング時にスレッド取得
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return {
    threads,
    loading,
    error,
    fetchThreads,
    deleteThread,
    createThread
  };
}