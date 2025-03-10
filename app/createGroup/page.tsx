"use client";
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useUserInfo } from '@/components/user-info';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, PlusCircleIcon } from "lucide-react";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupType, setGroupType] = useState('public');
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [groupUrl, setGroupUrl] = useState('/placeholder-group.jpg');
  
  const router = useRouter();
  const { userId } = useUserInfo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択ハンドラー
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // 選択したファイルのプレビュー表示
      const fileUrl = URL.createObjectURL(file);
      setGroupUrl(fileUrl);
    }
  };

  // カメラアイコンクリックハンドラー
  const onCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //ログインユーザー
    const createdBy = userId;

    // FormDataを使用して画像とテキストデータを一緒に送信
    const formData = new FormData();
    formData.append('groupName', groupName);
    formData.append('groupDescription', groupDescription);
    formData.append('groupType', groupType);
    if (createdBy) {
      formData.append('createdBy', createdBy);
    }
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
      
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Group created:', data);
        router.push(`/group/${data.group.id}`);
        setMessage('グループが作成されました！');
      } else {
        const errorData = await response.json();
        console.error('Error creating group:', errorData);
        setMessage('グループの作成に失敗しました。');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('グループの作成に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">新しいグループを作成</h1>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={groupUrl} alt="グループ画像" />
              <AvatarFallback>ユーザー</AvatarFallback>
            </Avatar>
            <Button
              onClick={onCameraClick}
              className="absolute bottom-0 right-0 rounded-full p-2"
              variant="secondary"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">グループ画像を設定</span>
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="groupName">グループ名</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="グループ名を入力"
              required
            />
          </div>
          <div>
            <Label htmlFor="groupDescription">グループの説明</Label>
            <Textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="グループの説明を入力"
              rows={4}
            />
          </div>
          <div>
            <Label>グループタイプ</Label>
            <RadioGroup value={groupType} onValueChange={setGroupType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">公開</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">非公開</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> グループを作成
          </Button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
