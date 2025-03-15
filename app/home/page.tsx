"use client";
import HomeContainer from "@/components/home/container";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reload') === 'true') {
      // パラメータを削除して履歴を書き換え
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      setTimeout(() => window.location.reload(), 100);
    }
  }, []);
  return <HomeContainer />;
}