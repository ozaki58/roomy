"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/components/user-info";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-avatar.jpg"); // 初期画像
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const userId = useUserInfo();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const createdBy = userId;
    const formData = new FormData();
    if (createdBy) {
      formData.append("userId", createdBy);
    }
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("interests", interests);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Profile updated:", data);
        setMessage("プロフィールが更新されました！");
        // もしAPIから画像URLなどの情報を返しているなら、それを反映可能
        if (data.user && data.user.image_url) {
          setAvatarUrl(data.user.image_url);
        }
        // 必要に応じてリダイレクトなど
        // router.push("/some-page");
      } else {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData);
        setMessage("プロフィールの更新に失敗しました。");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("プロフィールの更新に失敗しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">プロフィールを編集</h1>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} alt="プロフィール画像" />
              <AvatarFallback>ユーザー</AvatarFallback>
            </Avatar>
            <Button
              onClick={handleCameraClick}
              className="absolute bottom-0 right-0 rounded-full p-2"
              variant="secondary"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">プロフィール画像を変更</span>
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
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
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
