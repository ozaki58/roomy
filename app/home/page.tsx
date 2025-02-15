"use client";
import { Bell, Home, Search, Settings, User } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Group } from "@/lib/definitions";

export default function Page() {
    const [groupData, setGroupData] = useState<Group[]>([]);
  const [activeButton, setActiveButton] = useState<string>("public");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const userID = "693ee2a0-35c5-43f7-8a49-8f92070ff844"
  useEffect(() => {
    // 初回に公開グループを取得
    fetchGroups(userID, true);
  }, []);

  async function fetchGroups(userId: string, isPublic: boolean) {
    try {
      const response = await fetch(`/api/groups/getGroups?userId=${userId}&isPublic=${isPublic}`);
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
            activeButton === "public" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"
          }`}
          onClick={() => {
            fetchGroups(userID, true); // 公開グループを取得
            setActiveButton("public");
          }}
        >
          公開グループ
        </button>
        <button
          className={`px-4 py-2 ${
            activeButton === "private" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"
          }`}
          onClick={() => {
            fetchGroups(userID, false); // プライベートグループを取得
            setActiveButton("private");
          }}
        >
          プライベートグループ
        </button>
      </div>

      <div className="space-y-4">
        {filteredGroups.map((group: Group, index) => (
          <Link
            key={index}
            href={`/group/${group.name}`}
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
