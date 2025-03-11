"use client";
import { logout } from "@/app/logout/action";
import { Bell, Home, Search, Settings, User, CirclePlus, X, Menu } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    return (
        <>
            <button 
                onClick={toggleSidebar}
                className="text-white hover:bg-orange-600 p-2 rounded-full transition-colors"
                aria-label={showSidebar ? "サイドバーを閉じる" : "サイドバーを開く"}
            >
                <Menu size={24} />
            </button>

            {showSidebar && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleSidebar}
                />
            )}

            <div
                className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg border-l transition-transform duration-300 ease-in-out z-40 ${
                    showSidebar ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">メニュー</h2>
                    <button 
                        onClick={toggleSidebar}
                        className="p-1 rounded-full hover:bg-gray-200"
                        aria-label="サイドバーを閉じる"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-4">
                    <a href="/home" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <Home className="mr-3" size={20} />
                        ホーム
                    </a>
                    <a href="/searchGroup" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <Search className="mr-3" size={20} />
                        探索
                    </a>
                    <a href="/createGroup" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <CirclePlus className="mr-3" size={20} />
                        グループ作成
                    </a>
                    <a href="/notification" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <Bell className="mr-3" size={20} />
                        通知
                    </a>
                    <a href="/profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <User className="mr-3" size={20} />
                        プロフィール
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <Settings className="mr-3" size={20} />
                        設定
                    </a>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t">
                    <form action={logout}>
                        <button 
                            type="submit"
                            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            ログアウト
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}