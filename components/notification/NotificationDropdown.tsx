"use client";
import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, Heart, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useNotifications, Notification } from '@/app/hooks/useNotifications';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    loading,
    markAsRead,
    markAllAsRead
  } = useNotifications();
  
  // ドロップダウンを開いたときに通知を既読にする
  useEffect(() => {
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  }, [open, unreadCount, markAllAsRead]);
  
  // 通知をクリックしたときの処理
  const handleNotificationClick = (notification: Notification) => {
    setOpen(false);
    
    // 通知タイプに応じたアクション
    if (notification.related_id) {
      switch (notification.type) {
        case 'thread':
          router.push(`/thread/${notification.related_id}`);
          break;
        case 'comment':
          router.push(`/thread/${notification.related_id}`);
          break;
        case 'group':
          router.push(`/group/${notification.related_id}`);
          break;
        case 'like':
          router.push(`/thread/${notification.related_id}`);
          break;
        default:
          break;
      }
    }
    
    // まだ未読の場合は既読にする
    if (!notification.is_read) {
      markAsRead([notification.id]);
    }
  };
  
  // 通知のタイムスタンプをフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MM月dd日 HH:mm', { locale: ja });
  };
  
  // 通知タイプに応じたアイコンを取得
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'thread': return <BarChart className="h-4 w-4 text-blue-500" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'like': return <Heart className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-[#FF5722]" />;
    }
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-white text-xs text-[#FF5722] font-bold flex items-center justify-center border-2 border-[#FF5722]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-lg border-[#FF5722]/20">
        <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white flex items-center justify-between p-4">
          <h3 className="font-medium">通知</h3>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 px-2">
              すべて既読にする
            </Button>
          )}
        </div>
        
        <div className="max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#FF5722]/30 border-t-[#FF5722] rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">読み込み中...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-orange-50 border-b last:border-b-0 transition-colors ${
                  !notification.is_read ? 'bg-orange-50/70' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {/* 通知タイプに応じたアイコン */}
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {/* ユーザーアバター（実際のデータがあれば表示） */}
                      
                      {notification.actor_image && (
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={notification.actor_image} alt={notification.actor_name || ""} />
                          <AvatarFallback className="bg-orange-200 text-[#FF5722] text-xs">
                            {notification.actor_name ? notification.actor_name.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <p className="text-sm font-medium line-clamp-2">{notification.content}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {formatDate(notification.created_at)}
                      </p>
                      {!notification.is_read && (
                        <div className="h-2 w-2 rounded-full bg-[#FF5722]"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">通知はありません</p>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-50 border-t text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#FF5722] hover:bg-orange-100 text-xs w-full"
            onClick={() => {
              router.push('/notification');
              setOpen(false);
            }}
          >
            すべての通知を表示
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 