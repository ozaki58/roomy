"use client";
import React from "react";
import { useParams } from "next/navigation";

import { TextareaForm } from "@/components/textareaForm";
import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/components/user-info";
import { useThreads } from "@/app/hooks/useThreads";
import { useGroup } from "@/app/hooks/useGroup";

import ThreadListContainer from "@/components/threadListContainer";

export default function GroupPage() {
  const params = useParams();
  const groupId = Array.isArray(params.id) ? params.id[0] : params.id;
  const userId = useUserInfo();
  
  // カスタムフックを使用
  const { threads, loading: threadsLoading, createThread } = useThreads(groupId);
  const { groupName, isMember, loading: groupLoading, joinGroup, leaveGroup } = useGroup(groupId, userId);

  // ローディング状態の表示
  if (threadsLoading || groupLoading) {
    return <div className="p-6">読み込み中...</div>;
  }

  // スレッド作成ハンドラー
  const handleCreateThread = async (content: string) => {
    if (userId) {
      await createThread(content, userId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">{groupName || groupId}</h1>
        {!isMember ? (
          <Button onClick={joinGroup} variant="secondary" className="ml-4">
            参加する
          </Button>
        ) : (
          <Button onClick={leaveGroup} variant="secondary" className="ml-4">
            脱退する
          </Button>
        )}
      </div>
      
      {/* スレッド作成フォーム - isMemberがtrueの場合のみ表示 */}
      {isMember && (
        <TextareaForm 
          userId={userId || ''} 
          onThreadSubmit={handleCreateThread}
        />
      )}
      
      {/* スレッド一覧 */}
      <ThreadListContainer
        threads={threads} 
        userId={userId || ''} 
        groupId={groupId}
      />
    </div>
  );
}