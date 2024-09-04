"use client"; // これを追加
import React, { useState } from 'react'
import { Search, Users } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GroupSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const groups = [
    { id: 1, name: 'モンスト', members: 150, image: '/placeholder.svg' },
    { id: 2, name: 'ぷあぷあ愛好者', members: 200, image: '/placeholder.svg' },
    { id: 3, name: '星すクラブ', members: 75, image: '/placeholder.svg' },
  ]

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        <div className="p-4 bg-[#FF5722] text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold">roomy</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <Users className="h-6 w-6" />
          </Button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="グループ・チャット・ユーザーを検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Tabs defaultValue="recommended" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommended">おすすめ</TabsTrigger>
              <TabsTrigger value="public">公開グループ</TabsTrigger>
              <TabsTrigger value="private">プライベートグループ</TabsTrigger>
            </TabsList>
            <TabsContent value="recommended" className="mt-4">
              {filteredGroups.map(group => (
                <div key={group.id} className="flex items-center p-4 border-b last:border-b-0">
                  <img src={group.image} alt={group.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h2 className="font-semibold">{group.name}</h2>
                    <p className="text-sm text-gray-500">{group.members} 参加中</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <span className="sr-only">Join group</span>
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="public">公開グループの内容がここに表示されます。</TabsContent>
            <TabsContent value="private">プライベートグループの内容がここに表示されます。</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}