"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Group } from "@/lib/definitions";
import GroupSearchPresentation from "./presentation";

export default function GroupSearchContainer() {
  // データと状態管理
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // グループデータ取得
  const fetchPublicGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const isPublic = true;
      const response = await fetch(`/api/groups?isPublic=${isPublic}`);
      
      if (!response.ok) {
        throw new Error("グループの取得に失敗しました");
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
    fetchPublicGroups();
  }, [fetchPublicGroups]);

  // 検索クエリの更新
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // フィルタリングされたグループリスト
  const filteredGroups = groupData.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // グループクリックハンドラ
  const handleGroupClick = useCallback((group: Group) => {
    router.push(`/group/${group.id}`);
  }, [router]);

  return (
    <GroupSearchPresentation
      groups={filteredGroups}
      searchQuery={searchQuery}
      isLoading={isLoading}
      error={error}
      onSearchChange={handleSearchChange}
      onGroupClick={handleGroupClick}
      onRetry={fetchPublicGroups}
    />
  );
}