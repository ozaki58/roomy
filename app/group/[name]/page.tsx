"use client"; // これを追加
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Thread } from '@/components/types';  // types.ts からインポート
import { TextareaForm } from '@/components/textareaForm';
import ThreadList from '@/components/threadList';
export default function GroupPage() {
    const params = useParams();  // URLから動的パラメータを取得
    const encodedGroupName = Array.isArray(params.name) ? params.name[0] : params.name;  // 配列の場合は最初の要素を取得
    const groupName = decodeURIComponent(encodedGroupName);  // デコードして読みやすい形に変換
    const [threadsData,setThreadsData] = useState<Thread[]>( [
        {
          author: "ひらりん@",
          date: "2024年8月17日 午前12:34",
          content: "皆さん、こんばんは。実はうちのチームのメンバーが...",
          reactions: "👍😢",
          reactionCount: 6,
          commentCount: 4,
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
        <div className="p-6">
            <h1 className="text-3xl font-bold">{groupName} グループ</h1>
            <p>このグループには、たくさんのメンバーが参加しています。</p>
            <TextareaForm addThread={addThread} />
            <ThreadList threads={threadsData} />
        </div>
    );
}
