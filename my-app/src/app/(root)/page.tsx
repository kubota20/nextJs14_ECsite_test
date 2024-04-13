import { UserButton } from "@clerk/nextjs";

const SteupPage = () => {
  return (
    <div className="p-4">
      {/* UserButton サインアウトした後に移動する*/}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default SteupPage;
