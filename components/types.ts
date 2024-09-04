// src/types.ts
export interface Comment {
    author: string;
    content: string;
    date: string;
  }
  
  export interface Thread {
    id:number;
    author: string;
    date: string;
    content: string;
    reactions: string;
    reactionCount: number;
    commentCount: number;
    shareCount: number;
    comments: Comment[];
  }
  