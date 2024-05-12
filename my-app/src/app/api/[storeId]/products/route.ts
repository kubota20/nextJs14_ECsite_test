import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

// product に渡す
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      images,
      isFeatured,
      isArchived,
    } = body;

    // ユーザIDが問題がある場合
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // nameが問題がある場合
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    // imagesが問題がある場合
    if (!images || !images.length) {
      return new NextResponse("images are required", { status: 400 });
    }

    // priceが問題がある場合
    if (!price) {
      return new NextResponse("price is required", { status: 400 });
    }

    // categoryIdが問題がある場合
    if (!categoryId) {
      return new NextResponse("category Id is required", { status: 400 });
    }

    // sizeIdsが問題がある場合
    if (!sizeId) {
      return new NextResponse("size Id is required", { status: 400 });
    }

    // colorIdが問題がある場合
    if (!colorId) {
      return new NextResponse("color Id is required", { status: 400 });
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
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        // 複数の画像を渡す時に使います
        images: {
          createMany: {
            data: [...images.map((images: { url: string }) => images)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);

    return new NextResponse("Interal error", { status: 500 });
  }
}

// product id を取得
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    // findMany 複数件取得 条件に一致する全てのレコードを取得
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        // 必要かどうかの選択ができるようになる
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        // 順番を決める
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);

    return new NextResponse("Interal error", { status: 500 });
  }
}
