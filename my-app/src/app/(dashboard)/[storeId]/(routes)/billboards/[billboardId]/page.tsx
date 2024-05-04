import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";

const billboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  // findUnique	取得 一意の識別子またはIDを指定する必要がある
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initiaData={billboard} />
      </div>
    </div>
  );
};

export default billboardPage;
