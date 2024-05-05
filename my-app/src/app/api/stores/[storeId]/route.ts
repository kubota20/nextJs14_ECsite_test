import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    // ユーザIDが問題がある場合
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ユーザー名が問題がある場合
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // storeIdに問題がある場合
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // prismaで作ったテーブルを持ってきてます
    // updateMany 複数件更新 条件に一致する全てのレコードを更新
    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    // ユーザIDが問題がある場合
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // storeIdに問題がある場合
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // prismaで作ったテーブルを持ってきてます
    // deleteMany 複数件削除 条件に一致する全てのレコードを削除する
    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
