"use client";

import Image from "next/image";

import { Product } from "@/types/types";
import IconButton from "./icon-button";

interface ProductCardProps {
  data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  return (
    <div className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
      {/* 画像 */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={data?.images?.[0]?.url}
          alt="画像"
          fill
          className="aspect-square object-cover rounded-md"
        />
        <div className="opacity-0 group-hover:opacity-100">
          <div className="flex gap-x-6 justify-center">
            <IconButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
