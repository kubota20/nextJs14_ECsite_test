import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumnProps } from "./components/columns";

const billboardsPage = async ({ params }: { params: { storeId: string } }) => {
  // findMany	複数件取得 条件に一致する全てのレコードを取得
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      // 順番を決めてます
      createdAt: "desc",
    },
  });

  const formattedBillboardColumn: BillboardColumnProps[] = billboards.map(
    (item) => ({
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "yyyy年MM月dd日 HH:mm"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboardColumn} />
      </div>
    </div>
  );
};

export default billboardsPage;
