import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";

const categoryPage = async ({ params }: { params: { categoryId: string } }) => {
  // findUnique	取得 一意の識別子またはIDを指定する必要がある
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initiaData={category} />
      </div>
    </div>
  );
};

export default categoryPage;
