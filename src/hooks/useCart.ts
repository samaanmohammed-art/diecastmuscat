"use client";

import { useCartStore, cartSelectors, type CartLine } from "@/stores/cart";

export const SHIPPING_FREE_THRESHOLD_OMR = 50;
export const SHIPPING_FLAT_OMR = 5;
export const VAT_RATE = 0.05; // 5% Oman VAT

export interface CartTotals {
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  itemCount: number;
}

export function calculateTotals(items: CartLine[]): CartTotals {
  const subtotal = items.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const shipping =
    subtotal === 0 || subtotal >= SHIPPING_FREE_THRESHOLD_OMR
      ? 0
      : SHIPPING_FLAT_OMR;
  const vat = +(subtotal * VAT_RATE).toFixed(3);
  const total = +(subtotal + shipping + vat).toFixed(3);

  return { subtotal, shipping, vat, total, itemCount };
}

/**
 * Composite hook that returns cart state plus computed totals.
 * Client-only (uses zustand store with persist).
 */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const totals = calculateTotals(items);

  return {
    items,
    ...totals,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isEmpty: items.length === 0,
  };
}

export { useCartStore, cartSelectors };
