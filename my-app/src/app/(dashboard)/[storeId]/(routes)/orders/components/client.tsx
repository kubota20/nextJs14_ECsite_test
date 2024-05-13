"use client";

import React from "react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { OrderColumnProps, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumnProps[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading title={`注文 (${data.length})`} description="あなたの注文" />

      {/* スペース */}
      <Separator />
      {/* スペース */}

      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};
