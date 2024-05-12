import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// product id を取得
export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    // productIdに問題がある場合
    if (!params.productId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // findUnique 取得 一意の識別子またはIDを指定する必要がある
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    // id 問題がある場合
    if (!product) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// product 修正
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      images,
      price,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    } = body;

    // ユーザIDが問題がある場合
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    // storeIdに問題がある場合
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // productIdに問題がある場合
    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
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

    // update	更新 条件に一致するレコードを更新,一意の識別子またはIDを指定する必要がある
    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        // images deleteMany: {},で中身を消して新しく追加します
        images: {
          deleteMany: {},
        },
      },
    });

    // update	更新 条件に一致するレコードを更新,一意の識別子またはIDを指定する必要がある
    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// product 消す
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    // productIdに問題がある場合
    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
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
    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
