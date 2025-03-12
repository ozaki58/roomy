"use client"

import { useState } from "react"
import { MessageSquare, X} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

import {UserProfile } from "./types"
import { useUserInfo } from "../app/hooks/user-info"

interface UserProfileButtonProps {
  threadOrComment_user: UserProfile;
  login_user: string;
 
}

export const UserProfileButton: React.FC<UserProfileButtonProps> = ({ threadOrComment_user, login_user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  

  
  // プライベートメッセージを開始する関数
  const startPrivateMessage = async () => {
    if (threadOrComment_user.id === login_user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: login_user,
          
          targetUserId: threadOrComment_user.id,
          targetUserName: threadOrComment_user.username
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "メッセージの開始に失敗しました");
      }
      
      setIsOpen(false);
      
      // 作成/取得したグループページに遷移
      router.push(`/group/${data.group.id}`);
      
    } catch (error) {
      console.error("メッセージ開始エラー:", error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "メッセージの開始に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => threadOrComment_user.id !== login_user && setIsOpen(true)}
        className="rounded-full hover:opacity-80 transition-opacity"
        aria-label={`${threadOrComment_user.username}のプロフィールを表示`}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={threadOrComment_user.image_url} alt={threadOrComment_user.username} />
          <AvatarFallback>{threadOrComment_user.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-0">
            <div className="flex justify-between items-center">
              <DialogTitle>プロフィール</DialogTitle>
              <DialogClose className="h-6 w-6 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">閉じる</span>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center relative">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={threadOrComment_user.image_url} alt={threadOrComment_user.username} />
                  <AvatarFallback>{threadOrComment_user.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">ユーザー名</h4>
                <div className="border rounded-md p-3 bg-muted/30">{threadOrComment_user.username}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">自己紹介</h4>
                <div className="border rounded-md p-3 min-h-[100px] bg-muted/30">
                  {threadOrComment_user.bio || "自己紹介はありません"}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">興味のあるゲームジャンル</h4>
                <div className="border rounded-md p-3 bg-muted/30">{threadOrComment_user.interests || "設定されていません"}</div>
              </div>
            </div>

            <Separator />

            <Button
              className="w-full"
              onClick={startPrivateMessage}
              disabled={isLoading || threadOrComment_user.id === login_user}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isLoading ? "処理中..." : "メッセージを送信"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

