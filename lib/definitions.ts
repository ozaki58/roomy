// User テーブル
export interface User {
    id: string; // プライマリキー
    username: string; // ユーザー名（ユニーク）
    email: string; // メールアドレス（ユニーク）
   
}

// Group テーブル
export interface Group {
    id: number; // プライマリキー
    image_url: string;
    name: string; // グループ名
    description: string; // グループの説明
    members: number; // グループのメンバー数
    isPublic: boolean; // 公開/非公開フラグ
    createdBy: number; // 作成者（User.idへの外部キー）
}

// Thread テーブル
export interface Thread {
    id: number; // プライマリキー
    userId: number; // 投稿者のユーザーID（User.idへの外部キー）
    groupId: number; // グループID（Group.idへの外部キー）
    title: string; // スレッドのタイトル
    // Remove duplicate property declaration
    // content: string; // スレッドの内容

    createdAt: Date; // 作成日時
    commentCount: number; // コメント数


    content: string; // スレッドの内容,

}

// Comment テーブル
export interface Comment {
    id: number; // プライマリキー
    threadId: number; // スレッドID（Thread.idへの外部キー）
    userId: number; // 投稿者のユーザーID（User.idへの外部キー）
    content: string; // コメントの内容
    createdAt: Date; // 作成日時
}

// FavoriteGroup 中間テーブル
export interface User_Group {
    id: number; // プライマリキー
    userId: number; // ユーザーID（User.idへの外部キー）
    groupId: number; // グループID（Group.idへの外部キー）
}

// Notification テーブル
export interface Notification {
    id: string;
    userId: string;         // 通知の受信者ID
    type: 'comment' | 'like' | 'mention' | 'stats';  // 通知タイプ
    sourceId: string;       // 関連するスレッドやコメントのID
    sourceContent: string;  // 関連する投稿の内容
    actorId: string;        // アクションを起こしたユーザーID
    actorName: string;      // アクションを起こしたユーザー名
    actorImage: string;     // アクションを起こしたユーザーの画像
    isRead: boolean;        // 既読フラグ
    createdAt: string;      // 作成日時
}
