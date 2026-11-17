"use client";

import { Suspense, type ReactNode } from "react";
import { PageCurtain } from "@/components/transition/PageCurtain";
import { Preloader } from "@/components/transition/Preloader";
import { TransitionProvider } from "@/components/transition/TransitionProvider";

export function TransitionRoot({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TransitionProvider>
        <Preloader />
        <PageCurtain />
        {children}
      </TransitionProvider>
    </Suspense>
  );
}
