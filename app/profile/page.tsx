"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { PlusCircleIcon } from 'lucide-react';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the profile data to your backend
    console.log({ username, bio, interests });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">プロフィールを編集</h1>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder-avatar.jpg" alt="プロフィール画像" />
              <AvatarFallback>ユーザー</AvatarFallback>
            </Avatar>
            <Button className="absolute bottom-0 right-0 rounded-full p-2" variant="secondary">
              <Camera className="h-4 w-4" />
              <span className="sr-only">プロフィール画像を変更</span>
            </Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username">ユーザー名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力"
              required
            />
          </div>
          <div>
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="自己紹介を入力"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="interests">興味のあるゲームジャンル</Label>
            <Input
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="例: アクション、RPG、戦略"
            />
          </div>
          <Button type="submit" className="w-full">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> プロフィールを更新
          </Button>
        </form>
      </div>
    </div>
  );
}