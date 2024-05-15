import { Category } from "@/types/types";
import { RequestOptions } from "@/lib/utils";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(URL, {
      RequestOptions,
      // revalidate 時間ベースデータ検証 キャッシュの保存時間を3600秒（1時間）に指定
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};
