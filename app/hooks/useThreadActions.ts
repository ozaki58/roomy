import { useCallback } from 'react';
import { Thread } from '@/components/types';

export function useThreadActions(groupId?: string) {
  const deleteThread = useCallback(async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("スレッド削除に失敗しました");
      return await response.json();
    } catch (error) {
      console.error("スレッド削除エラー:", error);
      throw error;
    }
  }, []);

  const fetchThreadById = useCallback(async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}`);
      if (!response.ok) throw new Error("スレッド取得に失敗しました");
      const data = await response.json();
      return data.thread as Thread;
    } catch (error) {
      console.error("スレッド取得エラー:", error);
      throw error;
    }
  }, []);

  return {
    deleteThread,
    fetchThreadById
  };
}