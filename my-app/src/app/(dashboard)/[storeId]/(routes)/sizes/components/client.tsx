"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumnProps, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

// data初期のtypeの確認に使いました
// import { Billboard } from "@prisma/client";

interface SizeClientProps {
  data: SizeColumnProps[];
}

export const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`サイズ (${data.length})`}
          description="あなたのサイズ"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          追加
        </Button>
      </div>
      {/* スペース */}
      <Separator />
      {/* スペース */}
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="サイズ API" />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};
