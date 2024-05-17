import qs from "query-string";
import { Product } from "@/types/types";
import { RequestOptions } from "@/lib/utils";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

export const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      categoryId: query.categoryId,
      colorId: query.colorId,
      sizeId: query.sizeId,
      isFeatured: query.isFeatured,
    },
  });
  try {
    const res = await fetch(URL, {
      RequestOptions,
      // revalidate 時間ベースデータ検証 キャッシュの保存時間を300秒（5分）に指定
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch Products:", error);
    throw error;
  }
};
