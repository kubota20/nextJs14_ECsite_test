import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      // Prismaの OrderからOrderItemのproductを使います
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // paidOrders　OrderItemのproductを使います
  const totalRevenue = paidOrders.reduce((total, order) => {
    // OrderItemのproductにあるpriceを使います
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price.toNumber();
    }, 0);

    // orderItems 内のすべての商品の価格を合計します。初期値は 0 です。
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
