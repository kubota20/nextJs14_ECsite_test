import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumnProps } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  // findMany	複数件取得 条件に一致する全てのレコードを取得
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      // 順番を決めてます
      createdAt: "desc",
    },
  });

  const formattedOrderColumn: OrderColumnProps[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    // productテーブルにあるnameを取り出してます
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(","), // 取得した商品名の配列をカンマ区切りにします
    // formatter 数値が適切な言語や地域に依存した形式で表示されます
    // 注文した時に item.orderItems 内のすべての商品の価格を合計します。初期値は 0 です。
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return (total = Number(item.product.price));
      }, 0)
    ),
    createdAt: format(item.createdAt, "yyyy年MM月dd日 HH:mm"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrderColumn} />
      </div>
    </div>
  );
};

export default OrdersPage;
