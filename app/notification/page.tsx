import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, BarChart } from "lucide-react"

export default function Notifications() {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <main className="container mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="verified">返信</TabsTrigger>
              <TabsTrigger value="mentions">いいね</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="flex items-start space-x-4">
                <BarChart className="h-6 w-6 mt-1 text-blue-500" />
                <div>
                  <p className="font-semibold">あなたの投稿が71票を獲得しました</p>
                  <p className="text-sm text-gray-600">lobiの代わりになるアプリを作ろう思っているのですが需要ありますか？</p>
                
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Heart className="h-6 w-6 mt-1 text-red-500" />
                <div>
                  <p className="font-semibold">
                    <Avatar className="w-6 h-6 inline-block mr-2">
                      <AvatarImage src="/placeholder-avatar-1.jpg" alt="天使ちゃん" />
                      <AvatarFallback>天使</AvatarFallback>
                    </Avatar>
                    天使ちゃん と 
                    <Avatar className="w-6 h-6 inline-block mx-2">
                      <AvatarImage src="/placeholder-avatar-2.jpg" alt="てるて" />
                      <AvatarFallback>てる</AvatarFallback>
                    </Avatar>
                    てるて があなたの投稿にいいねしました
                  </p>
                  <p className="text-sm text-gray-600">lobiの代わりになるアプリを作ろう思っているのですが需要ありますか？</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MessageSquare className="h-6 w-6 mt-1 text-green-500" />
                <div>
                  <p className="font-semibold">
                    <Avatar className="w-6 h-6 inline-block mr-2">
                      <AvatarImage src="/placeholder-avatar-1.jpg" alt="天使ちゃん" />
                      <AvatarFallback>天使</AvatarFallback>
                    </Avatar>
                    天使ちゃん があなたの投稿に返信しました
                  </p>
                  <p className="text-sm text-gray-600">あれはリーダーに権限が強すぎて使いにくかったなぁ</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reply">
              <p className="text-center text-gray-500">返信の通知はありません</p>
            </TabsContent>
            <TabsContent value="good">
              <p className="text-center text-gray-500">いいねの通知はありません</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}