import { Product } from "@/types/types";
import { RequestOptions } from "@/lib/utils";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export const getProduct = async (id: string): Promise<Product[]> => {
  try {
    // revalidate 時間ベースデータ検証 キャッシュの保存時間を3600秒（1時間）に指定
    const res = await fetch(`${URL}/${id}`, RequestOptions, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch Product:", error);
    throw error;
  }
};
