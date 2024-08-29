import React from "react"
import { Bell, MessageCircle, Search, User, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Thread {
  author: string;
  date: string;
  content: string;
  reactions: string;
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  comments: Comment[];
}

interface Comment {
  author: string;
  content: string;
  date: string;
}
const ThreadCard: React.FC<{ thread: Thread }> = ({ thread }) => (
  <div className="bg-white rounded-lg shadow mb-4">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{thread.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{thread.author}</div>
            <div className="text-sm text-gray-500">{thread.date}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <p className="mb-4">{thread.content}</p>
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <button className="flex items-center space-x-1">
          <span>{thread.reactions}</span>
          <span>{thread.reactionCount}</span>
        </button>
        <button>コメント {thread.commentCount}</button>
        <button>共有する {thread.shareCount}</button>
      </div>
    </div>
    <div className="border-t p-4">
      <div className="space-y-4">
        {thread.comments.map((comment, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{comment.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="font-semibold">{comment.author}</div>
                <p className="text-sm">{comment.content}</p>
              </div>
              <div className="text-xs text-gray-500 mt-1">{comment.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function ThreadList({ threads }: { threads: Thread[] }) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {threads.map((thread, index) => (
            <ThreadCard key={index} thread={thread} />
          ))}
        </div>
      </main>
    </div>
  )
}