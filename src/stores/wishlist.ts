import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) =>
        set((state) =>
          state.ids.includes(productId)
            ? { ids: state.ids.filter((x) => x !== productId) }
            : { ids: [productId, ...state.ids] }
        ),
      has: (productId) => get().ids.includes(productId),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "diecast-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const wishlistSelectors = {
  count: (s: WishlistState) => s.ids.length,
};
