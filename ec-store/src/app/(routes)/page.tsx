import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import { getBillboard } from "@/actions/get-billboard";

const HomePage = async () => {
  const billboard = await getBillboard("ec3aaa06-6b5d-4a96-abd3-02c993c93a37");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
      </div>
    </Container>
  );
};

export default HomePage;
