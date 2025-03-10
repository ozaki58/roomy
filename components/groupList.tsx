import React from "react";
import { Group } from "@/lib/definitions";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupListProps {
  groups: Group[];
  onGroupClick: (group: Group) => void;
  emptyMessage?: string;
  layout?: "card" | "row"; // 表示レイアウトのオプション
}

export default function GroupList({
  groups,
  onGroupClick,
  emptyMessage = "グループが見つかりませんでした",
  layout = "card"
}: GroupListProps) {
  // グループがない場合のメッセージ
  if (groups.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // カードレイアウト（searchGroup用）
  if (layout === "card") {
    return (
      <div className="space-y-2">
        {groups.map(group => (
          <div
            key={group.id}
            onClick={() => onGroupClick(group)}
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <img
              src={group.image_url || "/placeholder.svg"}
              alt={group.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h2 className="font-semibold">{group.name}</h2>
              <p className="text-sm text-gray-500">{group.members} 参加中</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              <span className="sr-only">Join group</span>
              <Users className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  }

  // 行レイアウト（home用）
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => onGroupClick(group)}
          className="flex items-center p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
        >
          <img
            src={group.image_url || "/placeholder.svg"}
            alt={group.name}
            className="w-20 h-20 rounded mr-6"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold">{group.name}</h3>
            <p className="text-gray-500">{group.members} 参加中</p>
          </div>
          <span className="text-yellow-500 text-2xl">●</span>
        </div>
      ))}
    </div>
  );
}