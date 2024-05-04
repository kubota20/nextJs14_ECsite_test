"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Store } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// icon
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";

interface SettingsFormPageProps {
  initiaData: Store;
}

const formScheme = z.object({
  name: z.string().min(2, { message: "2文字以上を入力してください" }),
});

type SettingsFormValues = z.infer<typeof formScheme>;

const SettingsForm: React.FC<SettingsFormPageProps> = ({ initiaData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formScheme),
    defaultValues: initiaData,
  });

  // お店の名前変更
  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      // 中身の更新
      router.refresh();

      toast.success("更新しました");
    } catch (error) {
      toast.error("何か問題が発生しました、やり直して下さい。");
    } finally {
      setLoading(false);
    }
  };

  // お店の削除
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);

      router.refresh();
      // 削除されたら残ってるお店のページに行き
      // 全て削除されたらホームページに戻る
      router.push("/");
      toast.success("お店が削除されました");
    } catch (error) {
      toast.error(
        "エラーが起きました。すべての製品とカテゴリのフィルターを削除したことを確認してください"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="設定" description="ストアの設定" />
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="お店の名前"
                      {...field}
                    />
                  </FormControl>
                  {/* エラーメッセージ */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            変更
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
