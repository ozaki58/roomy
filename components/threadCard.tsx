import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thread } from "@/components/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Trash2, MessageCircle, ThumbsUp, Star } from "lucide-react";
import CommentItem from "./commentItem";
import { useThreadActions } from "@/app/hooks/useThreadActions";
import ErrorBoundary from "./errorBoundary";
import { CommentError } from "./error";
import { UserProfileButton } from "./user-profile-modal";
import { login } from "@/app/login/action";
import { useToast } from "./ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { useThreads } from "@/app/hooks/useThreads";

interface ThreadCardProps {
  thread: Thread;
  isThreadLiked: (threadId: string) => boolean;
  isThreadFavorited: (threadId: string) => boolean;
  isInModal?: boolean;
 
  onCommentClick?: () => void;
  userId: string;
  login_userName?: string;
  onCommentDeleted?: (commentId: string) => void;
  onThreadDeleted?: (threadId: string) => void;
  onLikeToggled?: (threadId: string, isLiked: boolean) => void;
  onFavoriteToggled?: (threadId: string, isFavorited: boolean) => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  isInModal=false,
  isThreadLiked,
  isThreadFavorited,
  onCommentClick,
  userId,
  login_userName,
  onCommentDeleted,
  onThreadDeleted,
  onLikeToggled,
  onFavoriteToggled
}) => {

  // 初期状態を取得して設定
  const initialLikedState = isThreadLiked(thread.id);
  const initialFavoritedState = isThreadFavorited(thread.id);
  
  console.log(`スレッド ${thread.id} 初期状態:`, { liked: initialLikedState, favorited: initialFavoritedState });
  
  const [likeCount, setLikeCount] = useState(thread.likes_count || 0);
  const [isLiked, setIsLiked] = useState(initialLikedState);
  const [isFavorite, setIsFavorite] = useState(initialFavoritedState);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const formattedTime = formatDistanceToNow(new Date(thread.created_at), {
    addSuffix: true,
    locale: ja,
  });
  const { toast } = useToast();

  // 外部状態の変更を監視して更新
  useEffect(() => {
    const newLikedState = isThreadLiked(thread.id);
    const newFavoritedState = isThreadFavorited(thread.id);
    
    console.log(`スレッド ${thread.id} 状態更新:`, { 
      liked: newLikedState, 
      prevLiked: isLiked,
      favorited: newFavoritedState,
      prevFavorited: isFavorite
    });
    
    if (!isLikeLoading && newLikedState !== isLiked) {
      setIsLiked(newLikedState);
    }
    if (!isFavoriteLoading && newFavoritedState !== isFavorite) {
      setIsFavorite(newFavoritedState);
    }
  }, [isThreadLiked, isThreadFavorited, thread.id, isLiked, isFavorite, isLikeLoading, isFavoriteLoading]);

const { deleteThread } = useThreadActions();
  const handleDeleteClick = async () => {
    try {
      await deleteThread(thread.id);
      if (onThreadDeleted) {
        onThreadDeleted(thread.id);
      }
    } catch (error) {
      console.error("スレッド削除エラー:", error);
    }
  }
  const handleLike = async () => {
    if (isLikeLoading) return;
    
    try {
      setIsLikeLoading(true);
      const currentLikedState = isLiked;
      const threadId = thread.id; // スレッドIDを明示的に変数に
      console.log(`いいね開始 - スレッド ${threadId}:`, { 現在の状態: currentLikedState, 新しい状態: !currentLikedState });
      
      // ローカル状態の先行更新
      setIsLiked(!currentLikedState);
      setLikeCount(prev => currentLikedState ? prev - 1 : prev + 1);
      
      const response = await fetch(`/api/threads/${threadId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          like: !currentLikedState
        }),
      });

      if (!response.ok) {
        // 失敗したら元に戻す
        console.log(`いいね失敗 - スレッド ${threadId}`);
        setIsLiked(currentLikedState);
        setLikeCount(prev => currentLikedState ? prev + 1 : prev - 1);
        throw new Error("いいねの更新に失敗しました");
      }
      
      // グローバル状態も更新
      if (onLikeToggled) {
        console.log(`いいねコールバック実行 - スレッド ${threadId}`, { 新状態: !currentLikedState });
        await onLikeToggled(threadId, !currentLikedState);
      }
      
      console.log(`いいね完了 - スレッド ${threadId}`, { 新状態: !currentLikedState });
    } catch (error) {
      console.error("いいねエラー:", error);
      toast({
        title: "いいねに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (isFavoriteLoading) return;
    
    try {
      setIsFavoriteLoading(true);
      const currentFavoriteState = isFavorite;
      const threadId = thread.id; // スレッドIDを明示的に変数に
      console.log(`お気に入り開始 - スレッド ${threadId}:`, { 現在の状態: currentFavoriteState, 新しい状態: !currentFavoriteState });
      
      // ローカル状態の先行更新
      setIsFavorite(!currentFavoriteState);
      
      const response = await fetch(`/api/threads/${threadId}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          favorite: !currentFavoriteState 
        }),
      });

      if (!response.ok) {
        // 失敗したら元に戻す
        console.log(`お気に入り失敗 - スレッド ${threadId}`);
        setIsFavorite(currentFavoriteState);
        throw new Error("お気に入りの更新に失敗しました");
      }
      
      // グローバル状態も更新
      if (onFavoriteToggled) {
        console.log(`お気に入りコールバック実行 - スレッド ${threadId}`, { 新状態: !currentFavoriteState });
        await onFavoriteToggled(threadId, !currentFavoriteState);
      }
      
      console.log(`お気に入り完了 - スレッド ${threadId}`, { 新状態: !currentFavoriteState });
    } catch (error) {
      console.error("お気に入りエラー:", error);
      toast({
        title: "お気に入りに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit message:", id);
    // 編集機能の実装（今後の拡張用）
  };

  return (
    <div className="bg-white rounded-lg shadow mb-0 relative">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <UserProfileButton threadOrComment_user={thread.user} login_user={userId} />
            <div>
              <div className="font-semibold">{thread.user.username}</div>
              <div className="text-sm text-gray-500">{formattedTime}</div>
            </div>
          </div>
          {thread.user.id === userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(thread.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick}>
                  <Trash className="mr-2 h-4 w-4" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="mb-4 whitespace-pre-line">{thread.content}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
         
          <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1 ${isLiked ? 'text-blue-600 hover:text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={handleLike}
          disabled={isLikeLoading}
        >
          {isLikeLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          ) : (
            <ThumbsUp size={18} className={isLiked ? 'fill-blue-600' : ''} />
          )}
          <span>{likeCount}</span>
        </Button>
        <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            onClick={onCommentClick}
          >
            <MessageCircle size={18} />
            <span>{thread.comments_count || 0}</span>
          </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1 ${isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={handleFavorite}
          disabled={isFavoriteLoading}
        >
          {isFavoriteLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
          ) : (
            <Star size={18} className={isFavorite ? 'fill-yellow-500' : ''} />
          )}
        </Button>
        </div>
        
      </div>
      <div className="border-t p-4">
        <div className="space-y-4">
          {thread.comments && thread.comments.map((comment, index) => (
            <ErrorBoundary
            key={comment.id}
            fallback={<CommentError comment={comment} />}
          >
            <CommentItem 
              key={comment.id || index} 
              isInModal={isInModal}
              comment={comment} 
              userId={userId} 
            
              onCommentDeleted={onCommentDeleted}
            />
            </ErrorBoundary>
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default React.memo(ThreadCard);