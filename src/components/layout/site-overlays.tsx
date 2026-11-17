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

export function SiteOverlays() {
  return (
    <>
      <MobileCartBar />
      <CartDrawer />
      <CustomiseSheet />
    </>
  );
}
