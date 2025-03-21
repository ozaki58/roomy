"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LogOut, UserPlus, Bookmark, ThumbsUp, List, Star } from "lucide-react"; // アイコン追加

import { TextareaForm } from "@/components/textareaForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // タブコンポーネント
import { toast, useToast } from '@/components/ui/use-toast';
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
import { useThreads } from "@/app/hooks/useThreads";
import { useUserInfo } from "@/app/hooks/user-info";
import { useGroup } from "@/app/hooks/useGroup";
import { Thread } from "@/components/types";
import { createClient } from "@/app/utils/supabase/client";
import { ToastAction } from "@radix-ui/react-toast";
import { Session } from "@supabase/supabase-js";
// LeaveGroupModal コンポーネント
interface LeaveGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LeaveGroupModal: React.FC<LeaveGroupModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false 
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>グループから脱退しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            このグループから脱退すると、グループがホームから削除されます。
            再度参加することは可能ですが、グループが非公開の場合は招待が必要になる場合があります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            {isLoading ? "処理中..." : "脱退する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


const supabase = createClient();


export default function GroupPage() {


  const params = useParams();
  const groupId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const { toast } = useToast();
  const { userId, userProfile } = useUserInfo();
  const { 
    threads, 
    setThreads,
    loading: threadsLoading, 
    fetchThreads,
    createThread, 
    isThreadLiked,
    isThreadFavorited,
    fetchLikesForThreads,
    fetchFavoritesForThreads,
    getFavoritedThreads,
    updateThreadLikeStatus,
    updateThreadFavoriteStatus
  } = useThreads(groupId, userProfile);
  const { groupName, isMember, loading: groupLoading, joinGroup, leaveGroup } = useGroup(groupId, userId);
  
  // 選択中のタブ状態管理
  const [activeTab, setActiveTab] = useState("all");
  // 操作中のスレッドID管理
  const [pendingActionThreadIds, setPendingActionThreadIds] = useState<Record<string, boolean>>({});
  
  // 脱退確認モーダルの状態
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  // 脱退処理中の状態
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  
  const favoritedThreads = getFavoritedThreads();

  const unAuthenticated_toast = () => {
    if (userId==null) {
      toast({
        title: "ログインが必要です",
        description: "ログインが必要です",
        action: <ToastAction altText="ログイン" onClick={() => router.push('/login')}>
          ログイン
        </ToastAction>,
      });
    }
  }
    


  const handleCommentAdded = useCallback(async (threadId: string, updatedThread: Thread) => {

   
    console.log(`GroupPage: コメント追加通知 - スレッド ${threadId}`);
    setThreads(prev => 
      prev.map(thread => thread.id === threadId ? updatedThread : thread)
    );
  }, [threads, setThreads]);
  const handleThreadDeleted = useCallback((threadId: string) => {
    setThreads(prevThreads => prevThreads.filter(thread => thread.id !== threadId));
    

  }, [threads, setThreads]);


  const handleCommentDeleted = useCallback(async (threadId: string) => {
    await fetchThreads();
  }, [fetchThreads]);
  

  const handleLikeToggled = useCallback(async (threadId: string, isLiked: boolean) => {

    console.log(`GroupPage: いいねコールバック - スレッド ${threadId}:`, { 新状態: isLiked });
    
    
    updateThreadLikeStatus(threadId, isLiked);
    
    // スレッドIDを指定して最新状態を取得 (一括更新ではなく単一スレッドのみ)
    try {
      const response = await fetch(`/api/user/likes-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadIds: [threadId] }),
      });
      
      if (!response.ok) {
        throw new Error("いいねステータスの取得に失敗しました");
      }
      
      const data = await response.json();
      console.log(`GroupPage: いいね状態更新完了 - スレッド ${threadId}:`, data);
    } catch (error) {
      console.error("いいね状態更新エラー:", error);
    }
  }, [updateThreadLikeStatus]);

  const handleFavoriteToggled = useCallback(async (threadId: string, isFavorited: boolean) => {
  
    console.log(`GroupPage: お気に入りコールバック - スレッド ${threadId}:`, { 新状態: isFavorited });
    

    updateThreadFavoriteStatus(threadId, isFavorited);
    
    // スレッドIDを指定して最新状態を取得 (一括更新ではなく単一スレッドのみ)
    try {
      const response = await fetch(`/api/user/favorites-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadIds: [threadId] }),
      });
      
      if (!response.ok) {
        throw new Error("お気に入りステータスの取得に失敗しました");
      }
      
      const data = await response.json();
      console.log(`GroupPage: お気に入り状態更新完了 - スレッド ${threadId}:`, data);
    } catch (error) {
      console.error("お気に入り状態更新エラー:", error);
    }
  }, [updateThreadFavoriteStatus]);
  
  // タブ切り替え時の処理
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);
  
  // タブ切り替え時の状態再取得
  useEffect(() => {
    if (activeTab === "favorites") {
      // お気に入りタブ表示時に最新状態を再取得
      fetchFavoritesForThreads();
    }
  }, [activeTab, fetchFavoritesForThreads]);
  
  // 脱退ボタンクリック時の処理
  const handleLeaveClick = useCallback(() => {
    unAuthenticated_toast();
    setIsLeaveModalOpen(true);
  }, []);

  // グループ参加ボタンクリック時の処理
  const handleJoinGroup = useCallback(() => {
    unAuthenticated_toast();
    
    joinGroup();
  }, [joinGroup, toast]);

  // 脱退確認時の処理
  const handleConfirmLeave = useCallback(async () => {
    setIsLeaving(true);
    await leaveGroup();
    setIsLeaving(false);
    setIsLeaveModalOpen(false);
    router.push('/home');
    toast({
      title: "グループを退出しました",
      description: "グループから退出しました",
    });
  }, [leaveGroup, router, toast]);

  // スレッド作成ハンドラ
  const handleCreateThread = useCallback(async (content: string) => {
    if (userId) {
      await createThread(content);
    }
  }, [userId, createThread]);

  if (threadsLoading || groupLoading) {
    if (threadsLoading) {
      return <div className="p-6">スレッド読み込み中...</div>;
    }
    if (groupLoading) {
    return <div className="p-6">グループ読み込み中...</div>;
  }
  }
  // タブに応じたスレッドのフィルタリング（useCallbackではなく通常の関数に変更）
  const filteredThreads = () => {
    let filteredList = [...threads];
    
    switch (activeTab) {
      case "popular":
        // 人気順（例：コメント数や「いいね」が多い順）
        filteredList = filteredList.sort((a, b) => 
          (b.likes_count || 0) - (a.likes_count || 0)
        );
        break;
      case "favorites":
        // お気に入りしたスレッドのみ表示
        filteredList = filteredList.filter(thread => 
          // 操作中のスレッドも表示する
          isThreadFavorited(thread.id) || pendingActionThreadIds[thread.id]
        );
        break;
      case "all":
      default:
        // すべてのスレッド（デフォルト：新着順）
        // 何もしない
        break;
    }
    
    return filteredList;
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-3xl font-bold">{groupName || groupId}</h1>
        {!isMember ? (
          <Button 
            onClick={handleJoinGroup} 
            variant="outline" 
            className="ml-4 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 transition-colors group"
          >
            <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            参加する
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
        <div className="mb-8">
          <TextareaForm 
            userId={userId || ''} 
            onThreadSubmit={handleCreateThread}
          />
        </div>
      )}
      
      {/* タブナビゲーション */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center">
            <List className="w-4 h-4 mr-2" />
            すべて
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-2" />
            人気
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center">
            <Star className="w-4 h-4 mr-2" />
            お気に入り
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <ThreadListContainer
            threads={filteredThreads()} 
            userId={userId || '未指定'} 
            userProfile={userProfile || { id: '', username: '', image_url: '' }}
            isThreadLiked={isThreadLiked}
            onThreadDeleted={handleThreadDeleted}
            isThreadFavorited={isThreadFavorited}
            groupId={groupId}
            unAuthenticated_toast={unAuthenticated_toast}
            onLikeToggled={handleLikeToggled}
            onFavoriteToggled={handleFavoriteToggled}
            onCommentAdded={handleCommentAdded}
          />
        </TabsContent>
        
        <TabsContent value="popular" className="mt-4">
          <ThreadListContainer
            threads={filteredThreads()} 
            userId={userId || '未指定'} 
            userProfile={userProfile || { id: '', username: '', image_url: '' }}
            isThreadLiked={isThreadLiked}
            onThreadDeleted={handleThreadDeleted}
            isThreadFavorited={isThreadFavorited}
            groupId={groupId}
            unAuthenticated_toast={unAuthenticated_toast}
            onLikeToggled={handleLikeToggled}
            onFavoriteToggled={handleFavoriteToggled}
            onCommentAdded={handleCommentAdded}
          />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-4">
          {filteredThreads().length > 0 ? (
            <ThreadListContainer
              threads={filteredThreads()} 
              userId={userId || '未指定'} 
              userProfile={userProfile || { id: '', username: '', image_url: '' }}
              isThreadLiked={isThreadLiked}
              onThreadDeleted={handleThreadDeleted}
              isThreadFavorited={isThreadFavorited}
              groupId={groupId}
              unAuthenticated_toast={unAuthenticated_toast}
              onLikeToggled={handleLikeToggled}
              onFavoriteToggled={handleFavoriteToggled}
              onCommentAdded={handleCommentAdded}
            />
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Bookmark className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-600">お気に入りがありません</h3>
              <p className="text-gray-500 mt-1">スレッドをお気に入りに追加すると、ここに表示されます</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <LeaveGroupModal 
        isOpen={isLeaveModalOpen} 
        onClose={() => setIsLeaveModalOpen(false)} 
        onConfirm={handleConfirmLeave} 
        isLoading={isLeaving}
      />
    </div>
  );
}