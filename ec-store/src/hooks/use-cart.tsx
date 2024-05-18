import { create } from "zustand";
import { Product } from "@/types/types";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

interface CartProps {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

export const useCart = create(
  persist<CartProps>(
    (set, get) => ({
      items: [],

      addItem: (data: Product) => {
        const currentItems = get().items;
        // existingItem Product配列にあるidとProductにあるidが一致した時にイベントを起こす
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast("すでにカートに入ってます");
        }

        set({ items: [...get().items, data] });
        toast.success("カートに追加しました");
      },

      removeItem: (id: string) => {
        // Product配列にあるidとremoveItemにあるidが違えばイベントを起こす
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("商品を削除しました");
      },

      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
