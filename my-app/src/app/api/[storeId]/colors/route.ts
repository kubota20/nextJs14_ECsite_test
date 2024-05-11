import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

// color に渡す
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    // ユーザIDが問題がある場合
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // nameが問題がある場合
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    // valueが問題がある場合
    if (!value) {
      return new NextResponse("value is required", { status: 400 });
    }

    // storeIdが問題がある場合
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    // findFirst 取得 条件に一致する最初のレコードを取得
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // id 問題がある場合
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // create 作成
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST]", error);

    return new NextResponse("Interal error", { status: 500 });
  }
}

// color id を取得
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    // findMany 複数件取得 条件に一致する全てのレコードを取得
    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);

    return new NextResponse("Interal error", { status: 500 });
  }
}
