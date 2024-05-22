import prismadb from "@/lib/prismadb";

interface GraphDataProps {
  name: string;
  total: number;
}

export const getGraptRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData: GraphDataProps[] = [
    { name: "job", total: 0 },
    { name: "uuu", total: 0 },
    { name: "lll", total: 0 },
    { name: "nan", total: 0 },
    { name: "iia", total: 0 },
    { name: "sub", total: 0 },
    { name: "bob", total: 0 },
    { name: "nun", total: 0 },
    { name: "hhh", total: 0 },
    { name: "aab", total: 0 },
    { name: "kik", total: 0 },
    { name: "pup", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }
  return graphData;
};
