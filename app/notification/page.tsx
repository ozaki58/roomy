"use client";
import { useState, useEffect } from 'react';
import { useNotifications } from '@/app/hooks/useNotifications';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Bell, RefreshCw, MessageCircle, ThumbsUp, Users, 
  BarChart, Heart, MessageSquare 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  
  // 通知タイプに応じたアイコンを取得
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'thread': return <BarChart className="h-6 w-6 mt-1 text-blue-500" />;
      case 'comment': return <MessageSquare className="h-6 w-6 mt-1 text-green-500" />;
      case 'like': return <Heart className="h-6 w-6 mt-1 text-red-500" />;
      default: return <Bell className="h-6 w-6 mt-1 text-gray-500" />;
    }
  };
  
  // ユーザーアバター表示関数
  const renderUserAvatar = (notification: any) => {
    // アクター情報がある場合は表示
    if (notification.actor_name || notification.actor_image) {
      return (
        <Avatar className="w-6 h-6 inline-block mr-2">
          <AvatarImage 
            src={notification.actor_image || "/placeholder-avatar.jpg"} 
            alt={notification.actor_name || "ユーザー"} 
          />
          <AvatarFallback>
            {notification.actor_name ? notification.actor_name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      );
    }
    
    // アクター情報がない場合はデフォルトアバターを表示
    return (
      <Avatar className="w-6 h-6 inline-block mr-2">
        <AvatarImage src="/placeholder-avatar.jpg" alt="ユーザー" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5" />
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
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="comment">返信</TabsTrigger>
              <TabsTrigger value="like">いいね</TabsTrigger>
            </TabsList>
            
            {['all', 'comment', 'like'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.is_read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification.id, notification.related_id, notification.type)}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-semibold">
                            {/* すべての通知タイプでアバターを表示 */}
                            {renderUserAvatar(notification)}
                            {notification.content}
                          </p>
                        
                          
                      
                          <p className="text-xs text-gray-500 ml-2">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                        {notification.type === 'comment' && (
                          <p className="texs-m text-gray-500 mt-1 ml-2">
                            {notification.comment_details?.content || 'このコメントは削除されました'}
                          </p>
                        )}
                        {notification.type === 'thread' && (
                          <p className="texs-m text-gray-500 mt-1 ml-2">
                            {notification.thread_details?.content || 'このスレッドは削除されました'}
                          </p>
                        )}
                        {notification.type === 'like' && (
                          <p className="texs-m text-gray-500 mt-1 ml-2">
                            {notification.thread_details?.content || 'このいいねは削除されました'}
                          </p>
                        )} 
                        
              {/* //コメントにもいいね機能をつけた場合はlikeタイプスレッドとコメントで分けて適切なデータを取得する予定
               */}
                        {notification.related_id && (
                          <p className="text-sm text-gray-600 mt-1 ml-8">
                            スレッドをタップして表示
                          </p>
                        )}
                        {!notification.is_read && (
                          <div className="absolute top-0 right-0 mt-4 mr-4 h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12 border rounded-lg bg-gray-50">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">通知はありません</h3>
                    <p className="text-gray-500">
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
      </main>
    </div>
  );
}