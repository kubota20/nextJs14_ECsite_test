import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumnProps } from "./components/columns";

const categoriesPage = async ({ params }: { params: { storeId: string } }) => {
  // findMany	複数件取得 条件に一致する全てのレコードを取得
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      // 順番を決めてます
      createdAt: "desc",
    },
  });

  const formattedCategoryColumn: CategoryColumnProps[] = categories.map(
    (item) => ({
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
      createdAt: format(item.createdAt, "yyyy年MM月dd日 HH:mm"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategoryColumn} />
      </div>
    </div>
  );
};

export default categoriesPage;
