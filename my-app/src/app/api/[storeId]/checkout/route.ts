import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

// CORS 設定
const corsHeadels = {
  "Access-Control-Allow-Origin": "*", //全てのサイトを許可
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorizetion", //ヘッダーを定義
};

// オプション
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeadels });
}

// 渡す
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("product Ids are required");
  }

  // findMany 複数件取得 条件に一致する全てのレコードを取得
  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // 商品注文時に Stripeに渡します
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  // orEach 配列の各要素に対して一度ずつ実行
  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "JPY",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber(),
      },
    });
  });

  // create 作成
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    // success,canceledはec-store/src/app/(router)/cart/Summary.tsxで指定してます
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeadels });
}
