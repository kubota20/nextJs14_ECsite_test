"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Category } from "@prisma/client";
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

const formScheme = z.object({
  name: z.string().min(2, { message: "2文字以上を入力してください" }),
  billboardId: z.string().min(2, { message: "2文字以上を入力してください" }),
});

interface CategoryFormPageProps {
  initiaData: Category | null;
}

type CategoryFormValues = z.infer<typeof formScheme>;

const CategoryForm: React.FC<CategoryFormPageProps> = ({ initiaData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initiaData ? "Edit Category" : "Create Category";
  const description = initiaData ? "Edit a Category" : "Add a new Category";
  const toastMessage = initiaData ? "Category updated" : "Category created";
  const action = initiaData ? "Save changes" : "create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formScheme),
    defaultValues: initiaData || {
      name: "",
      billboardId: "",
    },
  });

  // 更新・作成
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initiaData) {
        // 既存のデータを更新
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        // 新しいデータを作成
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      // 中身の更新
      router.refresh();
      // billboardsページに飛ぶ
      router.push(`/${params.storeId}/billboards`);

      toast.success(toastMessage);
    } catch (error) {
      toast.error("何か問題が発生しました、やり直して下さい。");
    } finally {
      setLoading(false);
    }
  };

  // 削除
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );

      router.refresh();

      // 削除されたら画像ページに行き
      router.push(`${params.storeId}/billboards`);
      toast.success("削除されました");
    } catch (error) {
      toast.error("エラーが起きました");
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
          {/* Label Input */}
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
                      placeholder="カテゴリー名"
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
    </>
  );
};

export default CategoryForm;