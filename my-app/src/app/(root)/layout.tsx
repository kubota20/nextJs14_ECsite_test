import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    // idが違えばsign-inページに行く
    redirect("/sign-in");
  }

  // findFirst 取得	条件に一致する最初のレコードを取得
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  // idを参照してstoreidのページに行く
  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
