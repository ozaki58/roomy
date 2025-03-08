import React from "react";
import { Search, Users, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Group } from "@/lib/definitions";
import GroupList from "../groupList";

interface GroupSearchPresentationProps {
  groups: Group[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGroupClick: (group: Group) => void;
  onRetry: () => void;
}

export default function GroupSearchPresentation({
  groups,
  searchQuery,
  isLoading,
  error,
  onSearchChange,
  onGroupClick,
  onRetry
}: GroupSearchPresentationProps) {
  return (
    <div className="p-6">
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white shadow">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="グループ・チャット・ユーザーを検索"
                value={searchQuery}
                onChange={onSearchChange}
                className="pl-10 pr-4 py-2 w-full"
              />
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
                emptyMessage="公開グループが見つかりませんでした" 
                layout="card"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}