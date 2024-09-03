"use client"; // これを追加
import { Bell, Home, Search, Settings, User } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { useState } from "react";
import publicGroupsData from "@/data/publicGroup.json";
import privateGroupsData from "@/data/privateGroup.json"; // 修正: データのラップされたキー名を考慮
import favoriteGroupsData from "@/data/favoriteGroup.json";

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
    const [borderColor, setBorderColor] = useState("");
    const [textColor, setTextColor] = useState("text-gray-500");

    const onFavoriteClick = () => {
        setGroupData(favoriteGroupsData.favoriteGroups);
        setBorderColor("border-b-2 border-orange-500");
        setTextColor("text-orange-500");
    }
    const onpublicClick = () => {
        setGroupData(publicGroupsData.publicGroups);
        setBorderColor("border-b-2 border-orange-500");
        setTextColor("text-orange-500");
    }
    const onPrivateClick = () => {
        setGroupData(privateGroupsData.privateGroups);
        setBorderColor("border-b-2 border-orange-500");
        setTextColor("text-orange-500");
    }
    
    const [activeButton, setActiveButton] = useState<string>("recommended"); // 修正: アクティブなボタンを管理

    return (
        <div className="p-6">
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
                {groupData.map((game: Group, index) => (
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
