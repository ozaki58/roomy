"use client"; // これを追加

import Header from "@/components/header";
import Image from "next/image";

import ThreadList from '@/components/threadList'

import { TextareaForm } from "@/components/textareaForm";
import BottomNavigation from "@/components/bottom-navigation";
import React,{useState} from "react"
import { Thread } from "@/components/types"  // types.ts からインポート
import Sidebar from "@/components/sidebar";
export default function App() {
  
  const [threadsData,setThreadsData] = useState<Thread[]>( [
    {
      author: "ひらりん@",
      date: "2024年8月17日 午前12:34",
      content: "皆さん、こんばんは。実はうちのチームのメンバーが...",
      reactions: "👍😢",
      reactionCount: 6,
      commentCount: 3,
      shareCount: 1,
      comments: [
        {
          author: "ひらりん@",
          content: "結局またアカウントは凍結されたままで復帰出来ずに難航してるみたいです😢遠法だから認められないの一点張りみたいです。",
          date: "8月27日 午前12:49"
        },
        {
          author: "s819ひーし",
          content: "😭😭😭私のSERVERも bot altが処分されたのですが その原因が私のせいにされて　　SERVERでの私の居場所がなくなりました。...",
          date: "8月27日 午後7:49"
        },
      ],
    },
  ])

  const addThread = (newThread: Thread) => {
    setThreadsData([newThread, ...threadsData]) // 新しいスレッドを先頭に追加
  }

  return (
    <>
    
    <TextareaForm addThread={addThread} />
    <ThreadList threads={threadsData} />
    
    
    </>
    
  )
}
