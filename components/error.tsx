// スレッド読み込みエラー用コンポーネント
export function ThreadLoadingError({ onRetry }: { onRetry: () => void }) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <h3 className="text-red-700 font-medium mb-2">スレッドの読み込みに失敗しました</h3>
        <p className="text-red-600 mb-4">
          ネットワーク接続を確認し、もう一度お試しください。
        </p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
        >
          再読み込み
        </button>
      </div>
    );
  }
  
  // コメント表示エラー用コンポーネント
  export function CommentError({ comment }: { comment: { id: string, author?: string } }) {
    return (
      <div className="p-3 bg-gray-100 border border-gray-300 rounded-md">
        <p className="text-gray-700">
          このコメント（ID: {comment.id.substring(0, 8)}...）は表示できません
        </p>
      </div>
    );
  }
  
  // グループ検索エラー用コンポーネント
  export function GroupSearchError({ onRetry }: { onRetry: () => void }) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <h3 className="text-yellow-800 font-medium mb-2">グループ情報の取得に失敗しました</h3>
        <p className="text-yellow-700 mb-4">
          サーバーとの通信中にエラーが発生しました。
        </p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }