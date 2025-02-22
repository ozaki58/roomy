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
  const [groupName, setGroupName] = useState<string>("");

  // グループ詳細情報の取得
  async function fetchGroupDetail() {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      const data = await response.json();
      setGroupName(data.group.name);
    } catch (error) {
      console.error("Failed to fetch group details:", error);
    }
  }

  // スレッド一覧の取得
  async function fetchThreads() {
    try {
      const response = await fetch(`/api/threads?groupId=${groupId}`);
      const data = await response.json();
      setThreads(data.threads);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    }
  }

  useEffect(() => {
    if (groupId) {
      fetchGroupDetail();
      fetchThreads();
    }
  }, [groupId]);

  // スレッド削除後に state を更新するコールバック
  const handleThreadDeleted = (deletedThreadId: string) => {
    fetchThreads();
  };

  // スレッド作成後に最新のスレッド一覧を再取得
  const handleThreadCreated = (newThread: Thread) => {
    fetchThreads();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{groupName || groupId}</h1>
      <TextareaForm groupId={groupId} addThread={handleThreadCreated} />
      {/* ThreadList に onThreadDeleted をプロップスとして渡す */}
      <ThreadList threads={threads} onThreadDeleted={handleThreadDeleted} />
    </div>
  );
}
