"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ThreadList from "@/components/threadList";
import { TextareaForm } from "@/components/textareaForm";
import { Thread } from "@/components/types";
import { Button } from "@/components/ui/button";
export default function GroupPage() {
  const params = useParams();
  const groupId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [threads, setThreads] = useState<Thread[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [isMember, setIsMember] = useState<boolean>(false);
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

  // membership 状態を取得する関数
  async function fetchMembershipStatus() {
    try {
      const userId = "693ee2a0-35c5-43f7-8a49-8f92070ff844";
      const response = await fetch(`/api/groups/join/?userId=${userId}&groupId=${groupId}`);
      const data = await response.json();
      // API が { isMember: true/false } を返す前提
      setIsMember(data.isMember);
    } catch (error) {
      console.error("Failed to fetch membership status:", error);
    }
  }

  // 参加処理
  async function handleJoinGroup() {
    try {
      const userId = "693ee2a0-35c5-43f7-8a49-8f92070ff844";
      const response = await fetch(`/api/groups/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, groupId }),
      });
      if (!response.ok) {
        throw new Error("Failed to join group");
      }
      setIsMember(true);
    } catch (error) {
      console.error("Error joining group:", error);
    }
  }

  // 脱退処理
  async function handleLeaveGroup() {
    try {
      const userId = "693ee2a0-35c5-43f7-8a49-8f92070ff844";
      const response = await fetch(`/api/groups/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, groupId }),
      });
      if (!response.ok) {
        throw new Error("Failed to leave group");
      }
      setIsMember(false);
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  }

  useEffect(() => {
    if (groupId) {
      fetchGroupDetail();
      fetchThreads();
      fetchMembershipStatus();
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
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">{groupName || groupId}</h1>
        {/* ユーザーが参加していない場合は参加ボタン、参加中の場合は脱退ボタンを表示 */}
        {!isMember ? (
          <Button onClick={handleJoinGroup} variant="secondary" className="ml-4">
            参加する
          </Button>
        ) : (
          <Button onClick={handleLeaveGroup} variant="secondary" className="ml-4">
            脱退する
          </Button>
        )}
      </div>
      <TextareaForm groupId={groupId} addThread={handleThreadCreated} />
      <ThreadList threads={threads} onThreadDeleted={handleThreadDeleted} />
    </div>
  );
}
