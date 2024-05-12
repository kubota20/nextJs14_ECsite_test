import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// priceを日本の数値書式にします
export const formatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});
