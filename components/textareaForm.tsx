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
import { useThreads } from "@/app/hooks/useThreads";

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

  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // スレッド投稿の場合
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