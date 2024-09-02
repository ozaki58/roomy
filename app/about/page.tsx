import { Bell, Home, Search, Settings, User, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import  Sidebar  from "@/components/sidebar"
import RootLayout from "../layout"
export default function Page() {
    return (
        <RootLayout> {/* Layoutコンポーネントでラップ */}
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <header className="bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">ホーム</h2>
              <Input className="w-1/3" placeholder="グループ・チャット・ユーザーを検索" />
              <Menu className="text-gray-500" />
            </header>
    
            <div className="p-6">
              <div className="mb-6 flex border-b">
                <button className="px-4 py-2 text-orange-500 border-b-2 border-orange-500">おすすめ</button>
                <button className="px-4 py-2 text-gray-500">公開グループ</button>
                <button className="px-4 py-2 text-gray-500">クラン</button>
              </div>

          <div className="space-y-4">
            {[
              { name: "Fate/Grand Order", members: "5,700名" },
              { name: "私だけ？私だけなんですか？ 【総合】", members: "8,100名" },
              { name: "モンスターストライク 【総合】", members: "5,000名" },
            ].map((game, index) => (
              <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow">
                <img src={`/placeholder.svg?height=80&width=80`} alt={game.name} className="w-20 h-20 rounded mr-6" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{game.name}</h3>
                  <p className="text-gray-500">{game.members} 参加中</p>
                </div>
                <span className="text-yellow-500 text-2xl">●</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </RootLayout>
  )
}