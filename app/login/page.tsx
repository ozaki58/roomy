"use client";

import React, { useState, useTransition } from "react";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockIcon, MailIcon } from "lucide-react";
import { login, signup } from "./action";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ログインフォームの送信ハンドラー
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await login(formData);
    });
  };

  // サインアップフォームの送信ハンドラー
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await signup(formData);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "アカウント作成" : "ログイン"}
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            {isSignUp
              ? "以下の情報を入力して新規アカウントを作成してください"
              : "メールアドレスとパスワードでログインしてください"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" onValueChange={(value) => setIsSignUp(value === "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">ログイン</TabsTrigger>
              <TabsTrigger value="signup">新規登録</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    メールアドレス
                  </Label>
                  <div className="relative">
                    <Input
                      id="email-login"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="pl-3"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login" className="flex items-center gap-2">
                    <LockIcon className="h-4 w-4" />
                    パスワード
                  </Label>
                  <div className="relative">
                    <Input
                      id="password-login"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="pl-3"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isPending}>
                  {isPending ? "ログイン中..." : "ログイン"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    メールアドレス
                  </Label>
                  <div className="relative">
                    <Input
                      id="email-signup"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="pl-3"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="flex items-center gap-2">
                    <LockIcon className="h-4 w-4" />
                    パスワード
                  </Label>
                  <div className="relative">
                    <Input
                      id="password-signup"
                      name="password"
                      type="password"
                      placeholder="英子文字と数字の複合１０文字以上"
                      required
                      className="pl-3"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isPending}>
                  {isPending ? "アカウント作成中..." : "アカウント作成"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">または</span>
            </div>
          </div>
          {/* <Button variant="outline" className="w-full">
            Googleでログイン
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
