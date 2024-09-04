"use client"; // これを追加
import { Bell, Home, Search, Settings, User, CirclePlus } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            {showSidebar ? (
                <button
                    className="flex text-4xl text-black items-center cursor-pointer fixed right-10 top-6 z-50"
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    x
                </button>
            ) : (
                <svg
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="fixed z-30 flex items-center cursor-pointer right-10 top-6"
                    fill="#FFFFFF"
                    
                    viewBox="0 0 100 80"
                    width="40"
                    height="40"
                >
                    <rect width="100" height="10"></rect>
                    <rect y="30" width="100" height="10"></rect>
                    <rect y="60" width="100" height="10"></rect>
                </svg>
            )}

            <div
                className={`fixed top-0 right-0 w-64 h-full bg-white border-l transition-transform duration-300 ease-in-out z-40 ${
                    showSidebar ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <aside className="w-64 bg-white border-r h-full">
                    <div className="p-4">
                        
                    </div>
                    <nav className="mt-8">
                        <a href="/home" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200">
                            <Home className="mr-3" />
                            ホーム
                        </a>
                        <a href="/searchGroup" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
                            <Search className="mr-3" />
                            探索
                        </a>
                        <a href="/createGroup" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
                            <CirclePlus className="mr-3" />
                            グループ作成
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
                            <Bell className="mr-3" />
                            通知
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
                            <User className="mr-3" />
                            プロフィール
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
                            <Settings className="mr-3" />
                            設定
                        </a>
                    </nav>
                </aside>
            </div>
        </>
    );
}
