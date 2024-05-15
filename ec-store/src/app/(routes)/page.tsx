import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import { getBillboard } from "@/actions/get-billboard";
import { getProducts } from "@/actions/get-products";

const HomePage = async () => {
  const products = await getProducts({ isFinite: true });
  const billboard = await getBillboard("ec3aaa06-6b5d-4a96-abd3-02c993c93a37");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
      </div>
      <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
        <ProductList title="isFinite Product" items={products} />
      </div>
    </Container>
  );
};

export default HomePage;
