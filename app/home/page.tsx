"use client"; // これを追加
import { Bell, Home, Search, Settings, User } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { useState } from "react";
import publicGroupsData from "@/data/publicGroup.json";
import privateGroupsData from "@/data/privateGroup.json"; // 修正: データのラップされたキー名を考慮
import favoriteGroupsData from "@/data/favoriteGroup.json";
import { Input } from "@/components/ui/input";
export default function Page() {
    interface Group {
        id: number;
        name: string;
        description: string;
        members: number;
        isPublic: boolean;
        createdAt: string;
    }

    const [groupData, setGroupData] = useState<Group[]>(favoriteGroupsData.favoriteGroups); // 修正: おすすめグループを初期値に設定
    
    
    
    const [activeButton, setActiveButton] = useState<string>("recommended"); // 修正: アクティブなボタンを管理
    const [searchQuery, setSearchQuery] = useState<string>("");
    const filteredGroups = groupData.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    return (
        <div className="p-6">
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
            <div className="mb-6 flex border-b">
                <button
                    className={`px-4 py-2 ${activeButton === "recommended" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`} // 修正: アクティブなボタンのスタイル
                    onClick={() => {
                        setGroupData(favoriteGroupsData.favoriteGroups);
                        setActiveButton("recommended"); // 修正: アクティブボタンを設定
                    }}
                >
                    おすすめ
                </button>
                <button
                    className={`px-4 py-2 ${activeButton === "public" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`} // 修正: アクティブなボタンのスタイル
                    onClick={() => {
                        setGroupData(publicGroupsData.publicGroups);
                        setActiveButton("public"); // 修正: アクティブボタンを設定
                    }}
                >
                    公開グループ
                </button>
                <button
                    className={`px-4 py-2 ${activeButton === "private" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`} // 修正: アクティブなボタンのスタイル
                    onClick={() => {
                        setGroupData(privateGroupsData.privateGroups);
                        setActiveButton("private"); // 修正: アクティブボタンを設定
                    }}
                >
                    プライベートグループ
                </button>
            </div>

            <div className="space-y-4">
                {filteredGroups.map((game: Group, index) => (
                    <Link
                        key={index}
                        href={`/group/${game.name}`}
                        className="flex items-center p-4 bg-white rounded-lg shadow"
                    >
                        <img
                            src={`/placeholder.svg?height=80&width=80`}
                            alt={game.name}
                            className="w-20 h-20 rounded mr-6"
                        />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{game.name}</h3>
                            <p className="text-gray-500">{game.members} 参加中</p>
                        </div>
                        <span className="text-yellow-500 text-2xl">●</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
