import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  actor_name: string;
  actor_image: any;
  id: string;
  user_id: string;
  type: string;
  content: string;
  related_id?: string;
  is_read: boolean; 
  created_at: string;
  thread_details: {
    content: string;
  };
  comment_details: {
    content: string;
  };
  // like_details: {
  //   content: string;
  // };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 通知取得
  const fetchNotifications = useCallback(async (type?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL('/api/notifications', window.location.origin);
      if (type) url.searchParams.append('type', type);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('通知の取得に失敗しました');
      }
      
      const data = await response.json();
      setNotifications(data);
      
      // 未読数をカウント
      const unread = data.filter((notification: Notification) => !notification.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('通知取得エラー:', err);
      setError(err instanceof Error ? err.message : '通知の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 通知を既読にする
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!notificationIds.length) return;
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      });
      
      if (!response.ok) {
        throw new Error('通知の更新に失敗しました');
      }
      
      // 成功した場合、ローカルの状態も更新
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id)
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // 未読カウントを更新
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (err) {
      console.error('通知更新エラー:', err);
    }
  }, []);

  // すべての通知を既読にする
  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications
      .filter(notification => !notification.is_read)
      .map(notification => notification.id);
    
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  }, [notifications, markAsRead]);

  // 初回レンダリング時に通知を取得
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
} 