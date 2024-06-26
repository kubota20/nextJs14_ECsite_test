import { Product } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export const getProduct = async (id: string): Promise<Product[]> => {
  try {
    const res = await fetch(`${URL}/${id}`, {
      next: { revalidate: 0 },
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
