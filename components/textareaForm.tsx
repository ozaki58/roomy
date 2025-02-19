import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Thread, Comment } from "@/components/types";

// 入力内容のスキーマ定義
const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "投稿内容は10文字以上である必要があります。",
    })
    .max(160, {
      message: "投稿内容は160文字以内である必要があります。",
    }),
});

export function TextareaForm({
  addThread,
  addComment,
  // 例としてグループIDやスレッドIDが必要な場合はプロップスで受け取る
  groupId,
  threadId,
}: {
  addThread?: (thread: Thread) => void;
  addComment?: (comment: Comment) => void;
  groupId?: string;
  threadId?: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // スレッド投稿の場合
      if (addThread) {
        const response = await fetch("/api/threads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 必要に応じて groupId や作成者IDなども含める
          body: JSON.stringify({
            groupId, // ここは実際のグループIDを渡す
            content: data.bio,
            // 例: createdBy: 認証済みユーザーのID
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "スレッド作成に失敗しました");
        }

        const newThread = await response.json();
        // APIから返ってきたスレッドデータを使って state を更新
        addThread(newThread);
      }

      // コメント投稿の場合
      if (addComment) {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 必要に応じて threadId や作成者IDなども含める
          body: JSON.stringify({
            threadId, // ここは対象のスレッドIDを渡す
            content: data.bio,
            // 例: createdBy: 認証済みユーザーのID
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "コメント作成に失敗しました");
        }

        const newComment = await response.json();
        addComment(newComment);
      }

      toast({
        title: "投稿が完了しました！",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(data, null, 2)}
            </code>
          </pre>
        ),
      });
      form.reset();
    } catch (error: any) {
      console.error("投稿エラー:", error);
      toast({
        title: "投稿に失敗しました。",
        description: error.message || "不明なエラー",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormItem>
          <FormLabel>投稿内容</FormLabel>
          <FormControl>
            <Textarea
              placeholder="ここに投稿内容を書いてください"
              className="resize-none"
              {...form.register("bio")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button type="submit">投稿する</Button>
      </form>
    </Form>
  );
}
