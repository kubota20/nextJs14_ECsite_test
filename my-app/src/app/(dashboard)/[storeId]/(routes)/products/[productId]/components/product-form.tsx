"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Image, Product, Category, Size, Color } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const formScheme = z.object({
  name: z.string().min(2, { message: "2文字以上を入力してください" }),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(3, { message: "3文字以上の数字を入れて下さい" }),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

interface ProductFormPageProps {
  initiaData: (Product & { images: Image[] }) | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

type ProductFormValues = z.infer<typeof formScheme>;

const ProductForm: React.FC<ProductFormPageProps> = ({
  initiaData,
  categories,
  sizes,
  colors,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initiaData ? "Edit Product" : "Create Product";
  const description = initiaData ? "Edit a Product" : "Add a new Product";
  const toastMessage = initiaData ? "Product updated" : "Product created";
  const action = initiaData ? "Save changes" : "create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formScheme),
    defaultValues: initiaData
      ? { ...initiaData, price: parseFloat(String(initiaData?.price)) }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          sizeId: "",
          colorId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  // 更新・作成
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initiaData) {
        // 既存のデータを更新
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        // 新しいデータを作成
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      // 中身の更新
      router.refresh();
      // productsページに飛ぶ
      router.push(`/${params.storeId}/products`);

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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

      router.refresh();

      // 削除されたら画像ページに行き
      router.push(`${params.storeId}/products`);
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
          {/* 画像のアップロード */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        [
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ],
                      ])
                    }
                  />
                </FormControl>
                {/* エラーメッセージ */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name Input */}
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
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                  {/* エラーメッセージ */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="値段"
                      {...field}
                    />
                  </FormControl>
                  {/* エラーメッセージ */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger defaultValue={field.value}>
                        <SelectValue placeholder="Category Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* エラーメッセージ */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger defaultValue={field.value}>
                        <SelectValue placeholder="Size Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* エラーメッセージ */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger defaultValue={field.value}>
                        <SelectValue placeholder="Color Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default ProductForm;
