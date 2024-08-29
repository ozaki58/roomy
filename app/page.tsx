import Header from "@/components/header";
import Image from "next/image";

import ThreadList from '@/components/threadList'

import { TextareaForm } from "@/components/textareaForm";

export default function App() {
  const threadsData = [
    {
      author: "ひらりん@",
      date: "2024年8月17日 午前12:34",
      content: "皆さん、こんばんは。実はうちのチームのメンバーが...",
      reactions: "👍😢",
      reactionCount: 6,
      commentCount: 27,
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
        }
      ]
    },
    
    // Add more thread objects here...
  ]
  return (
    <>
    <Header />
    <ThreadList threads={threadsData} />
    <TextareaForm />
    </>
    
  )
}
