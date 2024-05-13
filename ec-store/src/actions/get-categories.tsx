import { Category } from "@/types/types";

// const URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const getCategories = async (): Promise<Category[]> => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // JSONデータを受け取ることを明示する
    },
  };

  const res = await fetch(
    "http://localhost:3000/api/ddb22882-5766-4263-bbc9-b0b515b109db/categories",
    requestOptions
  );

  return res.json();
};
