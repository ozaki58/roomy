"use client"

import { useState } from "react"
import { MessageSquare, X} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import {UserProfile } from "./types"


interface UserProfileButtonProps {
  thread_user: UserProfile;
  login_user: string;
}


export const UserProfileButton: React.FC<UserProfileButtonProps> = ({ thread_user, login_user }) => {
   
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => thread_user.id !== login_user && setIsOpen(true)}
        className="rounded-full hover:opacity-80 transition-opacity"
        aria-label={`${thread_user.username}のプロフィールを表示`}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={thread_user.image_url} alt={thread_user.username} />
          <AvatarFallback>{thread_user.username.charAt(0)}</AvatarFallback>
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
                  <AvatarImage src={thread_user.image_url} alt={thread_user.username} />
                  <AvatarFallback>{thread_user.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">ユーザー名</h4>
                <div className="border rounded-md p-3 bg-muted/30">{thread_user.username}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">自己紹介</h4>
                <div className="border rounded-md p-3 min-h-[100px] bg-muted/30">
                  {thread_user.bio || "自己紹介はありません"}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">興味のあるゲームジャンル</h4>
                <div className="border rounded-md p-3 bg-muted/30">{thread_user.interests || "設定されていません"}</div>
              </div>
            </div>

            <Separator />

            <Button
              className="w-full"
              onClick={() => {
                // ここに個人チャットを開始する処理を追加
                setIsOpen(false)
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              メッセージを送信
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

