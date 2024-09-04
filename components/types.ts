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
  
  export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;

  }

  export interface Group {
    id: number;
    name: string;
    members: User[];
   
    description: string;
    image: string;
   
    isPublic: boolean;
    createdAt: string;
    threads: Thread[];
  }


