// useUserInfo.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/app/utils/supabase/client";

import { UserProfile } from "@/components/types";

export function useUserInfo() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  
  // ユーザー情報をキャッシュするためのreference
  const userProfileCache = useRef<{[key: string]: UserProfile | null}>({});

  // キャッシュを活用したユーザープロフィール情報を取得する関数
  const fetchUserProfile = useCallback(async (id: string) => {
    try {
      // 既にキャッシュにある場合はそれを使用
      if (userProfileCache.current[id]) {
        console.log("Using cached profile for:", id);
        return userProfileCache.current[id];
      }
      
     

      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error("ユーザー情報の取得に失敗しました");
      }
      
      const data = await response.json();
      
      // キャッシュに保存
      userProfileCache.current[id] = data.user;
      return data.user;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    async function getUser() {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        const currentUserId = data.user.id;
        if (isMounted) {
          setUserId(currentUserId);
        }
        
        // すでにuserIdが同じ場合は再取得しない
        if (userId === currentUserId && userProfile) {
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        const profileData = await fetchUserProfile(currentUserId);
        if (isMounted) {
          setUserProfile(profileData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in getUser:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      // 認証状態変更時の処理
      console.log("Auth state changed:", event);
      
      const newUserId = session?.user?.id || null;
      // userIdが変わらない場合は何もしない
      if (newUserId === userId) return;
      
      setUserId(newUserId);
      
      if (newUserId) {
        const profileData = await fetchUserProfile(newUserId);
        if (isMounted) {
          setUserProfile(profileData);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]); 

  return {
    userId,
    userProfile,
    loading,
    refetch: async () => {
      if (userId) {
        // キャッシュをクリアしてから再取得
        if (userProfileCache.current[userId]) {
          delete userProfileCache.current[userId];
        }
        const profileData = await fetchUserProfile(userId);
        setUserProfile(profileData);
      }
    }
  };
}