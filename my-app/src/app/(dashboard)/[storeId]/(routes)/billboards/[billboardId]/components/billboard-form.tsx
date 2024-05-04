"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Billboard } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

const formScheme = z.object({
  label: z.string().min(2, { message: "2文字以上を入力してください" }),
  imageUrl: z.string().min(2, { message: "2文字以上を入力してください" }),
});

interface BillboardFormPageProps {
  initiaData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formScheme>;

const BillboardForm: React.FC<BillboardFormPageProps> = ({ initiaData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initiaData ? "Edit billboard" : "Create billboard";
  const description = initiaData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initiaData ? "Billboard updated" : "Billboard created";
  const action = initiaData ? "Save changes" : "create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formScheme),
    defaultValues: initiaData || {
      label: "",
      imageUrl: "",
    },
  });

  // お店の名前変更
  const onSubmit = async (data: BillboardFormValues) => {
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
        <Heading title={title} description={description} />
        {initiaData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
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
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard Label"
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
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default BillboardForm;
