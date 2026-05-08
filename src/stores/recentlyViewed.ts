import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types/database";

const MAX_ENTRIES = 12;

interface RecentlyViewedState {
  items: Product[];
  push: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      push: (product) =>
        set((state) => {
          const filtered = state.items.filter((p) => p.id !== product.id);
          return { items: [product, ...filtered].slice(0, MAX_ENTRIES) };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "diecast-recently-viewed",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
