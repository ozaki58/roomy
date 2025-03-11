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

import  { useState } from "react";
// 入力内容のスキーマ定義
const FormSchema = z.object({
  bio: z
    .string()

    .max(160, {
      message: "投稿内容は160文字以内である必要があります。",
    }),
});

interface TextareaFormProps {
  userId: string;
  onThreadSubmit?: (content: string) => Promise<void>;
  threadId?: string;
  onCommentSubmit?: (content: string) => Promise<void>;
}

export function TextareaForm({
  userId,
  onThreadSubmit,
  threadId,
  onCommentSubmit
}: TextareaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // スレッド投稿の場合
      if (isSubmitting) return;
      setIsSubmitting(true);
      if (onThreadSubmit) {
        await onThreadSubmit(data.bio);
        toast({
          title: "スレッドを投稿しました！",
        });
      }
      // コメント投稿の場合
      else if (threadId && onCommentSubmit) {
        await onCommentSubmit(data.bio);
        toast({
          title: "コメントを投稿しました！",
        });
      }
      
      // フォームをリセット
      form.reset();
    } catch (error: any) {
      console.error("投稿エラー:", error);
      toast({
        title: "投稿に失敗しました。",
        description: error.message || "不明なエラー",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "投稿中..." : "投稿する"}
        </Button>
      </form>
    </Form>
  );
}