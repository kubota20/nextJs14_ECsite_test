import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ColorClient } from "./components/client";
import { ColorColumnProps } from "./components/columns";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  // findMany	複数件取得 条件に一致する全てのレコードを取得
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      // 順番を決めてます
      createdAt: "desc",
    },
  });

  const formattedColorColumn: ColorColumnProps[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "yyyy年MM月dd日 HH:mm"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColorColumn} />
      </div>
    </div>
  );
};

export default ColorsPage;
