import React from "react";
import Modal from "./modal";
import ThreadCard from "@/components/threadCard";
import { TextareaForm } from "./textareaForm";
import { Thread } from "@/components/types";

interface ThreadDetailModalProps {
  thread: Thread | null;
  userId: string;
  onClose: () => void;
  onCommentDeleted: (commentId: string) => void;
  onThreadDeleted: (threadId: string) => void;
  onAddComment: (content: string) => Promise<void>;
}

export default function ThreadDetailModal({
  thread,
  userId,
  onClose,
  onCommentDeleted,
  onThreadDeleted,
  onAddComment
}: ThreadDetailModalProps) {
  if (!thread) return null;
  
  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <div>
        <h2 className="text-xl font-semibold mb-4">返信スレッド</h2>
        <ThreadCard 
          thread={thread} 
          userId={userId} 
          onCommentDeleted={onCommentDeleted}
          onThreadDeleted={onThreadDeleted}
        />
        <TextareaForm 
          threadId={thread.id} 
          userId={userId}
          onCommentSubmit={onAddComment}
        />
      </div>
    </Modal>
  );
}