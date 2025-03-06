import { UUID } from "crypto";

// src/types.ts
export interface Comment {
    id:UUID;  
    user_id: UUID;
    author: string;
    content: string;
    date: string;
    image_url:string; //コメント投稿者のプロフィール
  }
  
  export interface Thread {
    id:UUID;
    group_id: UUID;
    user_id: UUID;
    image_url:string;
    author: string;
    date: string;
    content: string;
    reactions: string;
    reactionCount: number;
    commentCount: number;
    shareCount: number;
    comments: Comment[];
  }
  
  export interface User {
    id: UUID;
    name: string;
    email: string;
    avatar: string;

  }

  export interface Group {
    id: UUID;
    name: string;
    members: User[];
   
    description: string;
    image: string;
   
    isPublic: boolean;
    createdAt: string;
    threads: Thread[];
  }


