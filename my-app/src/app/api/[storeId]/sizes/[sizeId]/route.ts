import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// size id を取得
export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    // sizeIdに問題がある場合
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    // findUnique 取得 一意の識別子またはIDを指定する必要がある
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    // id 問題がある場合
    if (!size) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// size 修正
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    // ユーザIDが問題がある場合
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // nameが問題がある場合
    if (!name) {
      return new NextResponse("label is required", { status: 400 });
    }

    // ユーザー名が問題がある場合
    if (!value) {
      return new NextResponse("image URL is required", { status: 400 });
    }

    // storeIdに問題がある場合
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // sizeIdに問題がある場合
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    // updateMany 複数件更新 条件に一致する全てのレコードを更新
    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// size 消す
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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

    // sizeIdに問題がある場合
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    // prismaで作ったテーブルを持ってきてます
    // deleteMany 複数件削除 条件に一致する全てのレコードを削除する
    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
