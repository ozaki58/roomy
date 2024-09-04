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
  
  const [threadsData,setThreadsData] = useState<Thread[]>( 
    []
  )

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
