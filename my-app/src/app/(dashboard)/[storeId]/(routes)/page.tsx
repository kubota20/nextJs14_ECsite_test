import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  // findFirst 取得	条件に一致する最初のレコードを取得
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId },
  });

  return <div>ストア: {store?.name}</div>;
};

export default DashboardPage;
