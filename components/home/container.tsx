"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Group } from "@/lib/definitions";
import { useUserInfo } from "@/components/user-info";
import HomePresentation from "./presentation";

export default function HomeContainer() {
  // データと状態管理
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<string>("public");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userID = useUserInfo();
  const router = useRouter();

  // グループデータ取得関数
  const fetchGroups = useCallback(async (userId: string, isPublic: boolean) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/groups/?userId=${userId}&isPublic=${isPublic}`
      );
      
      if (!response.ok) {
        throw new Error(`グループの取得に失敗しました: ${response.statusText}`);
      }
      
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      setError("グループの読み込み中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初期読み込み
  useEffect(() => {
    if (userID) {
      fetchGroups(userID, activeTab === "public");
    }
  }, [userID, activeTab, fetchGroups]);

  // 検索クエリの更新
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // タブ切り替え
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    if (userID) {
      fetchGroups(userID, tab === "public");
    }
  }, [userID, fetchGroups]);

  // グループクリックハンドラ
  const handleGroupClick = useCallback((group: Group) => {
    router.push(`/group/${group.id}`);
  }, [router]);

  // フィルタリングされたグループリスト
  const filteredGroups = groupData.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <HomePresentation
      groups={filteredGroups}
      searchQuery={searchQuery}
      activeTab={activeTab}
      isLoading={isLoading}
      error={error}
      onSearchChange={handleSearchChange}
      onTabChange={handleTabChange}
      onGroupClick={handleGroupClick}
      onRetry={() => fetchGroups(userID || "", activeTab === "public")}
    />
  );
}