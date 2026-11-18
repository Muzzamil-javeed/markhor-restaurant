import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { PageTransition } from "@/components/layout/page-transition";
import { SiteOverlays } from "@/components/layout/site-overlays";
import { ToastViewport } from "@/components/ui/toast-viewport";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col overflow-x-clip bg-background">
      <OfflineBanner />
      <Header />
      <div className="flex min-h-0 flex-1 flex-col pb-20 md:pb-0">
        <PageTransition>{children}</PageTransition>
      </div>
      <Footer />
      <SiteOverlays />
      <ToastViewport />
    </div>
  );
}
