import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// category id を取得
export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    // categoryIdに問題がある場合
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    // findUnique 取得 一意の識別子またはIDを指定する必要がある
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    // id 問題がある場合
    if (!category) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// category 修正
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    // ユーザIDが問題がある場合
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // nameが問題がある場合
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    // billboardIdが問題がある場合
    if (!billboardId) {
      return new NextResponse("billboard Id is required", { status: 400 });
    }

    // storeIdに問題がある場合
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // categoryIdに問題がある場合
    if (!params.categoryId) {
      return new NextResponse("category id is required", { status: 400 });
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
    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// category 消す
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
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

    // categoryIdに問題がある場合
    if (!params.categoryId) {
      return new NextResponse("category id is required", { status: 400 });
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
    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
