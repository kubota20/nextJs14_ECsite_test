import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { buffer } from "micro";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { ok } from "assert";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("stripe-signature") as string;

  if (!signature) {
    return NextResponse.json(
      {
        message: "Bad request",
      },
      {
        status: 400,
      }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log({
      type: event.type,
      id: event.id,
    });
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // customer_details?.address お客様情報、住所
  const address = session?.customer_details?.address;

  const adressComponents = [
    // 市、地区、郊外、町、または村。
    address?.city,
    // 国
    address?.country,
    // 住所ライン1
    address?.line1,
    // 住所2行目
    address?.line2,
    // 郵便番号
    address?.postal_code,

    address?.state,
  ];

  const addressString = adressComponents.filter((c) => c !== null).join(",");

  if (event.type === "checkout.session.completed") {
    // update 更新 条件に一致するレコードを更新,一意の識別子またはIDを指定する必要がある

    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    // updateMany 複数件更新 条件に一致する全てのレコードを更新
    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });

    return new NextResponse(null, { status: 200 });
  }
}
