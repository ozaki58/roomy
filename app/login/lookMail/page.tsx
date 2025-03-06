"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MailIcon, RefreshCwIcon, ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
export default function EmailVerification() {
  const [isResending, setIsResending] = useState(false)
  const [showChangeEmail, setShowChangeEmail] = useState(false)
  
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [emailInput, setEmailInput] = useState(email)
  const handleResendEmail = async () => {
    setIsResending(true)
    // TODO: Implement resend email logic
    
    setTimeout(() => {
      setIsResending(false)
    }, 2000)
  }

  const handleChangeEmail = async () => {
    // TODO: Implement change email logic
    console.log("Change email to:", emailInput)
    setShowChangeEmail(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
            <MailIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">メールをご確認ください</CardTitle>
          <CardDescription className="text-center text-gray-500">{email} 宛に確認メールを送信しました</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2 font-medium">次のステップ:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>メールボックスを確認してください</li>
              <li>メール内の確認リンクをクリックしてください</li>
              <li>確認後、自動的にログインされます</li>
            </ol>
          </div>

          {showChangeEmail ? (
            <div className="space-y-2">
              {/* <div className="flex items-center space-x-2">
                <Input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="新しいメールアドレス"
                />
                <Button onClick={handleChangeEmail}>変更</Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => setShowChangeEmail(false)}>
                キャンセル
              </Button> */}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <p>
                メールが届かない場合は、迷惑メールフォルダを確認するか、
                {/* <button
                  onClick={() => setShowChangeEmail(true)}
                  className="text-primary underline underline-offset-4 hover:text-primary/90"
                >
                  メールアドレスを変更
                </button> */}
                してください。
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {/* <Button variant="outline" className="w-full" onClick={handleResendEmail} disabled={isResending}>
            {isResending ? (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                送信中...
              </>
            ) : (
              "確認メールを再送信"
            )}
          </Button> */}
          <Link href="/login" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              ログインページに戻る
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

