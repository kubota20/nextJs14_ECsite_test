import { Billboard } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

export const getBillboard = async (id: string): Promise<Billboard> => {
  try {
    // revalidate 時間ベースデータ検証 キャッシュの保存時間を3600秒（1時間）に指定
    const res = await fetch(`${URL}/${id}`, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch Billboards:", error);
    throw error;
  }
};