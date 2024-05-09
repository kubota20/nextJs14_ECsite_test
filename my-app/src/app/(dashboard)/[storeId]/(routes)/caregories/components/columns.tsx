"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type BillboardColumnProps = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumnProps>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
