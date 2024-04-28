import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    // ユーザIDがない場合
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ユーザー名が違う場合
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // prismaで作ったテーブルを持ってきてます
    // create 作成
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST]", error);

    return new NextResponse("Interal error", { status: 500 });
  }
}
