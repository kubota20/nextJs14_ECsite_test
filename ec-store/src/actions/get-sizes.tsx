import { Size } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`;

export const getSizes = async (): Promise<Size[]> => {
  try {
    const res = await fetch(URL, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch Sizes:", error);
    throw error;
  }
};
