import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thread, Comment } from "@/components/types"; // types.ts からインポート
import ReplyBanner from "@/components/replyBanner";
import Modal from "./modal";
import { TextareaForm } from "./textareaForm";
import { useEffect, useState } from "react";
// ThreadCard コンポーネント
const ThreadCard: React.FC<{ thread: Thread }> = ({ thread }) => (
  <div className="bg-white rounded-lg shadow mb-0">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{thread.author}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{thread.author}</div>
            <div className="text-sm text-gray-500">{thread.date}</div>
          </div>
        </div>
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
              <AvatarFallback>{comment.author}</AvatarFallback>
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
);

// ThreadList コンポーネント
export default function ThreadList({ threads: initialThreads = [] }: { threads?: Thread[] }) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);

  useEffect(() => {
    setThreads(initialThreads || []);
  }, [initialThreads]);

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedThread(null);
  };

  const handleReplyClick = (thread: Thread) => { // 型を指定
    setSelectedThread(thread);
    setIsModalOpen(true);
  };

  const addComment = async (newComment: Comment) => {
    if (!selectedThread) return;
    try {
      // コメント投稿が成功した後、対象スレッドの最新状態を取得する
      const response = await fetch(`/api/threads/${selectedThread.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch updated thread");
      }
      const data = await response.json();
      const updatedThread: Thread = data.thread;
  
      // 選択中のスレッドと一覧の中の該当スレッドを更新
      setSelectedThread(updatedThread);
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === updatedThread.id ? updatedThread : thread
        )
      );
    } catch (error) {
      console.error("Error re-fetching thread:", error);
    }
  };
  

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {threads.map((thread, index) => (
            <div key={thread.id || index} className="mb-0">
              <ThreadCard thread={{ ...thread, comments: (thread.comments || []).slice(0, 2) }} />

              <ReplyBanner
                commentCount={thread.commentCount}
                onReplyClick={() => handleReplyClick(thread)}
              />
            </div>
          ))}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        {selectedThread && (
          <div>
            <h2 className="text-xl font-semibold mb-4">返信スレッド</h2>
            <ThreadCard thread={selectedThread} />
            <TextareaForm addComment={addComment} threadId={selectedThread.id}/>
          </div>
        )}
      </Modal>
    </div>
  );
}
