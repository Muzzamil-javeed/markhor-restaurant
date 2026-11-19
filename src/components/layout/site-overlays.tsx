"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () =>
    import("@/components/cart/cart-drawer").then((mod) => mod.CartDrawer),
  { ssr: false },
);
const CustomiseSheet = dynamic(
  () =>
    import("@/components/menu/customise-sheet").then(
      (mod) => mod.CustomiseSheet,
    ),
  { ssr: false },
);
const MobileCartBar = dynamic(
  () =>
    import("@/components/layout/mobile-cart-bar").then(
      (mod) => mod.MobileCartBar,
    ),
  { ssr: false },
);
const ActiveOrderReminder = dynamic(
  () =>
    import("@/components/order/active-order-reminder").then(
      (mod) => mod.ActiveOrderReminder,
    ),
  { ssr: false },
);

export function SiteOverlays() {
  return (
    <>
      <MobileCartBar />
      <ActiveOrderReminder />
      <CartDrawer />
      <CustomiseSheet />
    </>
  );
}
