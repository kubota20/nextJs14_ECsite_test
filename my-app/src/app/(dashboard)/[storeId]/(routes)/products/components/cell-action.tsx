"use client";
import { useState } from "react";
import { BillboardColumnProps } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { MoreHorizontal, Edit, Copy, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";

interface CellActionProps {
  data: BillboardColumnProps;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // IDコピーbtn
  const onClickCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("IDをコピーしました");
  };

  // 変更Btnのリンク
  const onClickLink = () => {
    router.push(`/${params.storeId}/products/${data.id}`);
  };

  // 画像削除btn
  const onClickDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);

      router.refresh();

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
        onConfirm={onClickDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onClickCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            IDをコピー
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClickLink}>
            <Edit className="mr-2 h-4 w-4" />
            変更
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
