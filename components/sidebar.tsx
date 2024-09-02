
import { Button } from "@/components/ui/button"

import { Bell, Home, Search, Settings, User, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export default function Sidebar (){
    return(
        
      <aside className="w-64 bg-white border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-orange-500">ゲームコミュニティ</h1>
      </div>
      <nav className="mt-8">
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200">
          <Home className="mr-3" />
          ホーム
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <Search className="mr-3" />
          探索
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <Bell className="mr-3" />
          通知
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <User className="mr-3" />
          プロフィール
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <Settings className="mr-3" />
          設定
        </a>
      </nav>
    </aside>
    )
    

}