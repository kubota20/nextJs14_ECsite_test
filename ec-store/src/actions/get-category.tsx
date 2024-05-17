import { Category } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

export const getCategory = async (): Promise<Category> => {
  try {
    const res = await fetch(URL, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch Category:", error);
    throw error;
  }
};
