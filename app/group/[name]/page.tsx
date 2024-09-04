"use client"; // これを追加
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Thread } from '@/components/types';  // types.ts からインポート
import { TextareaForm } from '@/components/textareaForm';
import ThreadList from '@/components/threadList';
import threadData from '@/data/threadData.json';
export default function GroupPage() {
    const params = useParams();  // URLから動的パラメータを取得
    const encodedGroupName = Array.isArray(params.name) ? params.name[0] : params.name;  // 配列の場合は最初の要素を取得
    const groupName = decodeURIComponent(encodedGroupName);  // デコードして読みやすい形に変換
    const [threadsData,setThreadsData] = useState<Thread[]>( 
        threadData.threadData
      )
    
      const addThread = (newThread: Thread) => {
        setThreadsData([newThread, ...threadsData]) // 新しいスレッドを先頭に追加
      }
    
 return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">{groupName} グループ</h1>
            <p>このグループには、たくさんのメンバーが参加しています。</p>
            <TextareaForm addThread={addThread} />
            <ThreadList threads={threadsData} />
        </div>
    );
}
