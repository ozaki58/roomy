// useUserInfo.tsx
'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client"; // クライアント側用の Supabase クライアント

export function useUserInfo() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient(); // await は不要です

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
      } else {
        setUserId(data.user?.id || null);
      }
    }
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user.id || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return userId;
}
