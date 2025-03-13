"use client";
import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
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
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">通知</h3>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              すべて既読にする
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">読み込み中...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 cursor-pointer hover:bg-muted transition-colors ${!notification.is_read ? 'bg-muted/50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              通知はありません
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 