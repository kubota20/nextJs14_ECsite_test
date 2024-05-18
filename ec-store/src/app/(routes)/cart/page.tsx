"use client";

import Container from "@/components/ui/container";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import CartItem from "./components/cart-item";
import Summary from "./components/sammary";

interface Props {}

const CartPage: React.FC<Props> = () => {
  const cart = useCart();

  //  const router = useRouter();

  return (
    <div className="bg-white">
      <Container>
        <div className="px4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">カート</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500">商品を追加して下さい</p>
              )}
              <ul>
                {cart.items.map((item) => (
                  <CartItem key={item.id} data={item} />
                ))}
              </ul>
            </div>
            <Summary />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
