import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareState {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) =>
        set((state) => {
          if (state.ids.includes(productId)) {
            return { ids: state.ids.filter((x) => x !== productId) };
          }
          if (state.ids.length >= MAX_COMPARE) return state;
          return { ids: [...state.ids, productId] };
        }),
      has: (productId) => get().ids.includes(productId),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "diecast-compare",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const compareSelectors = {
  count: (s: CompareState) => s.ids.length,
};
