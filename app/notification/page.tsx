"use client";
import { useState, useEffect } from 'react';
import { useNotifications } from '@/app/hooks/useNotifications';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, RefreshCw, MessageCircle, ThumbsUp, Users, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead,
    markAllAsRead
  } = useNotifications();
  const router = useRouter();
  
  // タブ変更時に通知を再取得
  useEffect(() => {
    const type = activeTab !== 'all' ? activeTab : undefined;
    fetchNotifications(type);
  }, [activeTab, fetchNotifications]);
  
  // 通知をクリックしたときの処理
  const handleNotificationClick = (notificationId: string, relatedId?: string, type?: string) => {
    // まだ未読の場合は既読にする
    markAsRead([notificationId]);
    
    // 通知タイプに応じたアクション
    if (relatedId) {
      switch (type) {
        case 'thread':
          router.push(`/thread/${relatedId}`);
          break;
        case 'comment':
          router.push(`/thread/${relatedId}`);
          break;
       
        case 'like':
          router.push(`/thread/${relatedId}`);
          break;
        default:
          break;
      }
    }
  };
  
  // 通知のタイムスタンプをフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };
  
  return (
    <div className="container py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          通知
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const type = activeTab !== 'all' ? activeTab : undefined;
              fetchNotifications(type);
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            更新
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={loading}
          >
            すべて既読にする
          </Button>
        </div>
      </div>
      
      {/* タブナビゲーション */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            すべて
          </TabsTrigger>
          <TabsTrigger value="thread" className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            スレッド
          </TabsTrigger>
          <TabsTrigger value="comment" className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            コメント
          </TabsTrigger>
          <TabsTrigger value="like" className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-2" />
            いいね
          </TabsTrigger>
        
        </TabsList>
        
        {/* すべてのタブコンテンツは同じレンダリングを使用 */}
        {['all', 'thread', 'comment', 'like', 'system'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="mt-4">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      !notification.is_read ? 'bg-muted/30 border-muted-foreground/30' : 'border-border'
                    }`}
                    onClick={() => handleNotificationClick(notification.id, notification.related_id, notification.type)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p>{notification.content}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="h-3 w-3 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 border rounded-lg bg-muted/10">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
                <h3 className="text-xl font-medium mb-2">通知はありません</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'all' 
                    ? '新しい通知が届くとここに表示されます' 
                    : `この種類（${activeTab}）の通知はありません`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      
    </div>
  );
}