import React from "react";
import Modal from "./modal";
import ThreadCard from "@/components/threadCard";
import { TextareaForm } from "./textareaForm";
import { Thread } from "@/components/types";
import ErrorBoundary from "./errorBoundary";
import { Button } from "@headlessui/react";

interface ThreadDetailModalProps {
    thread: Thread | null;
    userId: string;
    isThreadLiked: (threadId: string) => boolean;
    isThreadFavorited: (threadId: string) => boolean;
    unAuthenticated_toast: () => void;
    onClose: () => void;
    onCommentDeleted: (commentId: string) => void;
    onThreadDeleted: (threadId: string) => void;
    onAddComment: (content: string) => Promise<void>;
    onLikeToggled?: (threadId: string, isLiked: boolean) => void;
    onFavoriteToggled?: (threadId: string, isFavorited: boolean) => void;
}

export default function ThreadDetailModal({
    thread,
    userId,
    isThreadLiked,
    isThreadFavorited,
    unAuthenticated_toast,
    onClose,
    onCommentDeleted,
    onThreadDeleted,
    onAddComment,
    onLikeToggled,
    onFavoriteToggled
}: ThreadDetailModalProps) {
    if (!thread) return null;

    // ... existing code ...
    return (
        <Modal isOpen={true} onClose={onClose} size="responsive">
            <div className="w-full max-h-[80vh] overflow-y-auto px-2 sm:px-4">
                <h2 className="text-xl font-semibold mb-4">返信スレッド</h2>
                <ErrorBoundary
                    fallback={
                        <div className="p-4 text-center">
                            <p>スレッドの表示中にエラーが発生しました</p>
                            <Button onClick={onClose}>閉じる</Button>
                        </div>
                    }
                >
                    <ThreadCard
                        thread={thread}
                        userId={userId}
                        isThreadLiked={isThreadLiked}
                        isThreadFavorited={isThreadFavorited}
                        isInModal={true}
                        unAuthenticated_toast={unAuthenticated_toast}
                        onCommentDeleted={onCommentDeleted}
                        onThreadDeleted={onThreadDeleted}
                        onLikeToggled={onLikeToggled}
                        onFavoriteToggled={onFavoriteToggled}
                    />
                    <TextareaForm
                        threadId={thread.id}
                        userId={userId}
                        onCommentSubmit={onAddComment}
                    />
                </ErrorBoundary>
            </div>
                
        </Modal>
    );

}