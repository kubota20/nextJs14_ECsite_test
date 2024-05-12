import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumnProps } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  // findMany	複数件取得 条件に一致する全てのレコードを取得
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      // 順番を決めてます
      createdAt: "desc",
    },
  });

  const formattedProductColumn: ProductColumnProps[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    // formatterの中身　日本の数値書式にします
    // toNumber()　priceの型がDecimalなのでこれをnumberにします
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.category.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "yyyy年MM月dd日 HH:mm"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProductColumn} />
      </div>
    </div>
  );
};

export default ProductsPage;
