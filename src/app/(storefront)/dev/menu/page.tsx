import type { Metadata } from "next";
import { MenuCatalog } from "@/components/menu/menu-catalog";
import { menu } from "@/data/menu";

export const metadata: Metadata = {
  title: "Menu data",
  description: "Temporary listing of every Markhor menu category and item.",
};

export default function MenuDataPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8">
      <MenuCatalog categories={menu} eagerCount={menu.length} />
    </main>
  );
}
