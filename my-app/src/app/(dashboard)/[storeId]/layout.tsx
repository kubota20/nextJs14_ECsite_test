import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { storeId: string };
}>) {
  const { userId } = auth();

  if (!userId) {
    // idが違えばsign-inページに行く
    redirect("/sign-in");
  }

  // findFirst 取得	条件に一致する最初のレコードを取得
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  // idとuserIdが一致していなければホームページに行く
  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
