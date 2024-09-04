import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Thread, Comment } from "@/components/types";

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

export function TextareaForm({ addThread, addComment }: { addThread?: (thread: Thread) => void; addComment?: (comment: Comment) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newThread: Thread = {
      author: "新しいユーザー",
      date: new Date().toLocaleString(),
      content: data.bio,
      reactions: "👍",
      reactionCount: 0,
      commentCount: 0,
      shareCount: 0,
      comments: [],
    };

    const newComment: Comment = {
      author: "新しいユーザー",
      content: data.bio,
      date: new Date().toLocaleString(),
    };

    // コメント投稿の場合
    if (addComment) {
      addComment(newComment); // 新しいコメントを追加
      
    }

    // スレッド投稿の場合
    if (addThread) {
      addThread(newThread); // 新しいスレッドを追加
      
    }

    toast({
      title: "投稿が完了しました！",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormItem>
          <FormLabel>投稿内容</FormLabel>
          <FormControl>
            <Textarea placeholder="ここに投稿内容を書いてください" className="resize-none" {...form.register("bio")} />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button type="submit">投稿する</Button>
      </form>
    </Form>
  );
}
