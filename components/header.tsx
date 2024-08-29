import { Bell, MessageCircle, Search, User, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export default function Header (){
    return(
        <header className="flex items-center px-4 py-2 bg-[#FF5722] text-white">
        <div className="text-xl font-bold mr-4">BAND</div>
        <div className="flex-1 max-w-xl">
          <Input className="bg-white/20 border-none placeholder:text-white/70 text-white" placeholder="Band、ページ、投稿を検索" />
        </div>
        <nav className="flex items-center ml-4 space-x-4">
          <Button variant="ghost" className="text-white">新着フィード</Button>
          <Button variant="ghost" className="text-white">探す</Button>
          <Bell className="w-6 h-6" />
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">8</span>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </nav>
      </header>
    )
    

}