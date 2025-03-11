"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { LogOut, UserPlus } from "lucide-react";

import { TextareaForm } from "@/components/textareaForm";
import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/app/hooks/user-info";
import { useThreads } from "@/app/hooks/useThreads";
import { useGroup } from "@/app/hooks/useGroup";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import ThreadListContainer from "@/components/threadListContainer";

export default function GroupPage() {
  const params = useParams();
  const groupId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { userId, userProfile, loading } = useUserInfo();
  const { threads, loading: threadsLoading, createThread } = useThreads(groupId);
  const { groupName, isMember, loading: groupLoading, joinGroup, leaveGroup } = useGroup(groupId, userId);
  
  // 脱退確認モーダルの状態
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  // 脱退処理中の状態
  const [isLeaving, setIsLeaving] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  if (threadsLoading || groupLoading) {
    return <div className="p-6">読み込み中...</div>;
  }

  const handleCreateThread = async (content: string) => {
    if (userId) {
      await createThread(content, userId);
    }
  };
  
  // 脱退ボタンクリック時の処理
  const handleLeaveClick = () => {
    setShowLeaveConfirm(true);
  };
  const handleJoinGroup = async () => {
    setIsJoining(true);
    await joinGroup();
    setIsJoining(false);

  };
  // 脱退確認時の処理
  const handleConfirmLeave = async () => {
    setIsLeaving(true);
    await leaveGroup();
    setIsLeaving(false);
    setShowLeaveConfirm(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">{groupName || groupId}</h1>
        {!isMember ? (
          <Button 
          onClick={handleJoinGroup} 
          variant="outline" 
          disabled={isJoining}
          className="ml-4 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 transition-colors group"
        >
          <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          {isJoining ? "処理中..." : "参加する"}
        </Button>
        ) : (
          <Button 
            onClick={handleLeaveClick} 
            variant="outline" 
            className="ml-4 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
            脱退する
          </Button>
        )}
      </div>
      
      {isMember && (
        <TextareaForm 
          userId={userId || ''} 
          onThreadSubmit={handleCreateThread}
        />
      )}
      
      {/* スレッド一覧 */}
      <ThreadListContainer
        threads={threads} 
        userId={userId || '未指定'} 
        login_userName={userProfile?.username || '未指定'}
        groupId={groupId}
      />
      
      {/* 脱退確認モーダル */}
      <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>グループから脱退しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{groupName}」から脱退すると、このグループがhomeから削除されます
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLeave}
              disabled={isLeaving}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {isLeaving ? "処理中..." : "脱退する"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}