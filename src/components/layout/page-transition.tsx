"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Soft route enter — keyed by pathname so each navigation re-plays smoothly. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-enter">
      {children}
    </div>
  );
}
