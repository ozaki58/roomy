// ----- app/test/page.tsx -----
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import GroupList from '@/components/test_GroupList';

interface Group {
  id: string;
  name: string;
  description?: string | null;
  tags?: string[] | null;
  created_at: string;
  similarity?: number;
}

export default function test_groupsPage() {
  const [test_groups, settest_groups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Group[] | null>(null);
  
  // 初期ロード時にグループ一覧を取得
  useEffect(() => {
    async function fetchtest_groups() {
      try {
        const response = await fetch('/api/test_groups');
        if (!response.ok) throw new Error('Failed to fetch test_groups');
        const data = await response.json();
        settest_groups(data || []);
      } catch (error) {
        console.error('Error fetching test_groups:', error);
        alert('グループの読み込み中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    }
    
    fetchtest_groups();
  }, []);
  
  // 検索結果を処理
  const handleSearch = (results: Group[]) => {
    setSearchResults(results);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">グループ一覧</h1>
        <Link href="/create" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          新規グループ作成
        </Link>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      {loading ? (
        <p>読み込み中...</p>
      ) : searchResults ? (
        <>
          <h2 className="text-xl font-semibold mb-4">検索結果</h2>
          <GroupList test_groups={searchResults} />
          <button
            className="mt-4 text-blue-500 hover:underline"
            onClick={() => setSearchResults(null)}
          >
            全グループ表示に戻る
          </button>
        </>
      ) : (
        <GroupList test_groups={test_groups} />
      )}
    </div>
  );
}