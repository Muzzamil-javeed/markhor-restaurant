"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyVoucherCode,
  normaliseVoucherCode,
  type OrderType,
} from "@/lib/vouchers";

export type { OrderType };

export const ORDER_TYPES = ["delivery", "pickup", "dinein"] as const;

export const orderTypeLabels: Record<OrderType, string> = {
  delivery: "Delivery",
  pickup: "Pickup",
  dinein: "Dine-in",
};

export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  summary?: string;
  unitPrice: number;
  quantity: number;
  /** Admin-uploaded (or resolved) dish photo for cart / checkout. */
  imageSrc?: string | null;
  variantId?: string | null;
  choiceIds?: string[];
  addOnIds?: string[];
  note?: string;
};

type CartState = {
  lines: CartLine[];
  orderType: OrderType;
  voucherCode: string | null;
  voucherError: string | null;
  note: string;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  add: (item: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  /** @deprecated prefer add */
  addItem: (item: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  updateQty: (key: string, quantity: number) => void;
  /** @deprecated prefer updateQty */
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOrderType: (orderType: OrderType) => void;
  setNote: (note: string) => void;
  applyVoucher: (code: string) => { ok: boolean; reason?: string };
  removeVoucher: () => void;
};

function mergeLine(
  lines: CartLine[],
  item: Omit<CartLine, "quantity"> & { quantity?: number },
): CartLine[] {
  const quantity = item.quantity ?? 1;
  const existing = lines.find((line) => line.key === item.key);
  if (existing) {
    return lines.map((line) =>
      line.key === item.key
        ? {
            ...line,
            quantity: line.quantity + quantity,
            // Prefer the newest image when the same line is added again after a replace.
            imageSrc: item.imageSrc || line.imageSrc || null,
          }
        : line,
    );
  }
  return [
    ...lines,
    {
      key: item.key,
      itemId: item.itemId,
      name: item.name,
      summary: item.summary,
      unitPrice: item.unitPrice,
      quantity,
      imageSrc: item.imageSrc ?? null,
      variantId: item.variantId,
      choiceIds: item.choiceIds,
      addOnIds: item.addOnIds,
      note: item.note,
    },
  ];
}

function setQty(lines: CartLine[], key: string, quantity: number): CartLine[] {
  if (quantity <= 0) return lines.filter((line) => line.key !== key);
  return lines.map((line) =>
    line.key === key ? { ...line, quantity } : line,
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      const add: CartState["add"] = (item) =>
        set((state) => ({
          lines: mergeLine(state.lines, item),
          voucherError: null,
        }));

      const updateQty: CartState["updateQty"] = (key, quantity) =>
        set((state) => ({
          lines: setQty(state.lines, key, quantity),
          voucherError: null,
        }));

      return {
        lines: [],
        orderType: "delivery",
        voucherCode: null,
        voucherError: null,
        note: "",
        isDrawerOpen: false,
        openDrawer: () => set({ isDrawerOpen: true }),
        closeDrawer: () => set({ isDrawerOpen: false }),
        toggleDrawer: () =>
          set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
        add,
        addItem: add,
        updateQty,
        setQuantity: updateQty,
        remove: (key) =>
          set((state) => ({
            lines: state.lines.filter((line) => line.key !== key),
            voucherError: null,
          })),
        clear: () =>
          set({
            lines: [],
            voucherCode: null,
            voucherError: null,
            note: "",
          }),
        setOrderType: (orderType) =>
          set((state) => {
            const next: Partial<CartState> = {
              orderType,
              voucherError: null,
            };
            if (
              state.voucherCode &&
              orderType !== "delivery" &&
              state.voucherCode.toLowerCase() === "deliver20"
            ) {
              next.voucherCode = null;
              next.voucherError =
                "Delivery voucher removed — switch back to delivery to use it.";
            }
            return next;
          }),
        setNote: (note) => set({ note }),
        applyVoucher: (code) => {
          const state = get();
          const subtotal = state.lines.reduce(
            (sum, line) => sum + line.unitPrice * line.quantity,
            0,
          );
          const result = applyVoucherCode(code, subtotal, state.orderType);
          if (!result.ok) {
            set({ voucherError: result.reason, voucherCode: null });
            return { ok: false, reason: result.reason };
          }
          set({
            voucherCode: normaliseVoucherCode(code),
            voucherError: null,
          });
          return { ok: true };
        },
        removeVoucher: () =>
          set({ voucherCode: null, voucherError: null }),
      };
    },
    {
      name: "markhor-cart-v2",
      version: 2,
      partialize: (state) => ({
        lines: state.lines,
        orderType: state.orderType,
        voucherCode: state.voucherCode,
        note: state.note,
      }),
      migrate: (persisted) => {
        const data = (persisted ?? {}) as {
          lines?: CartLine[];
          orderType?: string;
          voucherCode?: string | null;
          note?: string;
        };
        const rawType = data.orderType;
        const orderType: OrderType =
          rawType === "dine-in" || rawType === "dinein"
            ? "dinein"
            : rawType === "pickup"
              ? "pickup"
              : "delivery";
        return {
          lines: Array.isArray(data.lines) ? data.lines : [],
          orderType,
          voucherCode: data.voucherCode ?? null,
          note: typeof data.note === "string" ? data.note : "",
        };
      },
    },
  ),
);

export function selectItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function selectSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}
