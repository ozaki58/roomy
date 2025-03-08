import React from "react";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Group } from "@/lib/definitions";
import GroupList from "../groupList";

interface HomePresentationProps {
  groups: Group[];
  searchQuery: string;
  activeTab: string;
  isLoading: boolean;
  error: string | null;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTabChange: (tab: string) => void;
  onGroupClick: (group: Group) => void;
  onRetry: () => void;
}

export default function HomePresentation({
  groups,
  searchQuery,
  activeTab,
  isLoading,
  error,
  onSearchChange,
  onTabChange,
  onGroupClick,
  onRetry
}: HomePresentationProps) {
  return (
    <div className="p-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="グループ・チャット・ユーザーを検索"
          value={searchQuery}
          onChange={onSearchChange}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      
      <div className="mb-6 flex border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "public"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => onTabChange("public")}
        >
          公開グループ
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "private"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => onTabChange("private")}
        >
          プライベートグループ
        </button>
      </div>

      {error && (
        <div className="text-center p-4 border border-red-200 rounded-md bg-red-50 mb-4">
          <p className="text-red-800">{error}</p>
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            再試行
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center p-6">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : (
        <GroupList 
          groups={groups} 
          onGroupClick={onGroupClick} 
          emptyMessage={`${activeTab === "public" ? "公開" : "プライベート"}グループが見つかりませんでした`}
          layout="row"
        />
      )}
    </div>
  );
}