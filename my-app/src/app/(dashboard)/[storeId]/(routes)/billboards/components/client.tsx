"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumnProps, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

// data初期のtypeの確認に使いました
// import { Billboard } from "@prisma/client";

interface BillboardClientProps {
  data: BillboardColumnProps[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`画像 (${data.length})`} description="あなたの画像" />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          追加
        </Button>
      </div>
      {/* スペース */}
      <Separator />
      {/* スペース */}
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};
