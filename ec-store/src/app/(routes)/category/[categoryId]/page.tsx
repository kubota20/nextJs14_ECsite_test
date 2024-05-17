import { getProducts } from "@/actions/get-products";
import { getSizes } from "@/actions/get-sizes";
import { getColors } from "@/actions/get-colors";
import { getCategory } from "@/actions/get-category";
import Container from "@/components/ui/container";
import Billboard from "@/components/billboard";

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  seartParams: {
    colorId: string;
    sizeId: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({
  params,
  seartParams,
}) => {
  const products = await getProducts({
    categoryId: params.categoryId,
    colorId: seartParams.colorId,
    sizeId: seartParams.sizeId,
  });

  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(params.categoryId);

  return (
    <div className="bg-white">
      <Container>
        <Billboard data={category.billboard} />
      </Container>
    </div>
  );
};

export default CategoryPage;
