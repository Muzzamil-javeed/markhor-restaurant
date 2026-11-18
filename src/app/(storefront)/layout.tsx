import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { MenuImageMapProvider } from "@/components/menu/menu-image-map-provider";
import { getMenuImageMap } from "@/lib/menu-image-map";

export default async function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  const imageMap = await getMenuImageMap();

  return (
    <MenuImageMapProvider map={imageMap}>
      <SiteShell>{children}</SiteShell>
    </MenuImageMapProvider>
  );
}
