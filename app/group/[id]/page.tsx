"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ThreadList from "@/components/threadList";
import { TextareaForm } from "@/components/textareaForm";
import { Thread } from "@/components/types";

export default function GroupPage() {
  const params = useParams();
  const groupId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [threads, setThreads] = useState<Thread[]>([]);

  // スレッド一覧を取得する関数
  async function fetchThreads() {
    try {
      const response = await fetch(`/api/threads?groupId=${groupId}`);
      const data = await response.json();
      setThreads(data.threads);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    }
  }

  // 初回ロード時、または groupId が変わったときにスレッドを取得
  useEffect(() => {
    if (groupId) {
      fetchThreads();
    }
  }, [groupId]);

 
  const handleThreadCreated = (newThread: Thread) => {
    // 新しいスレッドを受け取ったら、最新のスレッド一覧を再フェッチする
    fetchThreads();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">グループ詳細 (ID: {groupId})</h1>
      {/* スレッド作成フォームに groupId と addThread コールバックを渡す */}
      <TextareaForm groupId={groupId} addThread={handleThreadCreated} />
      {/* スレッド一覧 */}
      <ThreadList threads={threads} />
    </div>
  );
}
