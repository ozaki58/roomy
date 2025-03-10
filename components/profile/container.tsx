"use client";
import React, { useState, useRef, useEffect } from "react";
import ProfilePresentation from "./presentation";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/components/user-info";

export default function ProfileContainer() {
  const { userId, userProfile, loading } = useUserInfo();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-avatar.jpg");
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || "");
      setBio(userProfile.bio || "");
      setInterests(userProfile.interests || "");
      setAvatarUrl(userProfile.image_url || "/placeholder-avatar.jpg");
    }
  }, [userProfile]);


  if (loading) {
    return <div>読み込み中...</div>;
  }
  


  // ファイル選択ハンドラー
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);

      // 選択したファイルのプレビューURL作成
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(fileUrl);
    }
  };

  // カメラアイコンクリックハンドラー
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // フォーム送信ハンドラー
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
        if (data.user && data.user.image_url) {
          setAvatarUrl(data.user.image_url);
        }
      
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterests(e.target.value);
  };

  return (
    <ProfilePresentation
      username={username}
      bio={bio}
      interests={interests}
      avatarUrl={avatarUrl}
      message={message}
      fileInputRef={fileInputRef}
      onUsernameChange={handleUsernameChange}
      onBioChange={handleBioChange}
      onInterestsChange={handleInterestsChange}
      onFileChange={handleFileChange}
      onCameraClick={handleCameraClick}
      onSubmit={handleSubmit}
    />
  );
}