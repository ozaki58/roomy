import { UUID } from "crypto";

// src/types.ts
export interface UserProfile {
    id: string;
    username: string;
    image_url?: string;
    bio?: string;
    interests?: string;
    email?: string;
}

export interface Comment {
    id: string;
    thread_id: string;
    content: string;
    created_at: string;
    user: UserProfile;
}

export interface Thread {
    id: string;
    group_id: string;
    content: string;
    comments_count: number;
    created_at: string;
    user: UserProfile;
    reactions?: string;
    reactionCount?: number;
    commentCount?: number;
    shareCount?: number;
    comments?: Comment[];
    favorites?: boolean; // お気に入りしたユーザーIDの配列
    likes_count?: number; // いいね数
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



export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      test_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          tags: string[] | null
          embedding: number[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          tags?: string[] | null
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          tags?: string[] | null
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      match_test_groups: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          name: string
          description: string | null
          tags: string[] | null
          similarity: number
        }[]
      }
    }
  }
}