"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Group } from "@/lib/definitions";
import { useUserInfo } from "@/components/user-info";
export default function HomePage() {
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [activeButton, setActiveButton] = useState<string>("public");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const userID = useUserInfo();

  useEffect(() => {
    // 初回ロード時に公開グループを取得
    if (userID) {
      fetchGroups(userID, true);
    }
    else console.log("userId is nooooooot")
  }, [userID]);
  

  async function fetchGroups(userId: string, isPublic: boolean) {
    try {
      const response = await fetch(
        `/api/groups/?userId=${userId}&isPublic=${isPublic}`
      );
      const data = await response.json();
      
      setGroupData(data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }

  const filteredGroups = groupData.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className={`px-4 py-2 ${
            activeButton === "public"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => {
            if (userID) {
              fetchGroups(userID, true);
              setActiveButton("public");
            }
          }}
        >
          公開グループ
        </button>
        <button
          className={`px-4 py-2 ${
            activeButton === "private"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => {
            if (userID) {
              fetchGroups(userID, false);
              setActiveButton("private");
            }
          }}
        >
          プライベートグループ
        </button>
      </div>

      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <Link
          key={group.id}
          href={`/group/${group.id}`}
          className="flex items-center p-4 bg-white rounded-lg shadow"
        >
          <img
            src={`/placeholder.svg?height=80&width=80`}
            alt={group.name}
            className="w-20 h-20 rounded mr-6"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold">{group.name}</h3>
            <p className="text-gray-500">{group.members} 参加中</p>
          </div>
          <span className="text-yellow-500 text-2xl">●</span>
        </Link>
        
        ))}
      </div>
    </div>
  );
}
