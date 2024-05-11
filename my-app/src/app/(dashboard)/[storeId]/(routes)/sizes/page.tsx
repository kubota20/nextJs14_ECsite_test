import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { SizeColumnProps } from "./components/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  // findMany	複数件取得 条件に一致する全てのレコードを取得
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      // 順番を決めてます
      createdAt: "desc",
    },
  });

  const formattedSizeColumn: SizeColumnProps[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "yyyy年MM月dd日 HH:mm"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizeColumn} />
      </div>
    </div>
  );
};

export default SizesPage;
