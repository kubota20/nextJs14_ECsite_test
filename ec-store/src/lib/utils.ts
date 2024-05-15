import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// HTTP リクエスト
export const RequestOptions: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};
