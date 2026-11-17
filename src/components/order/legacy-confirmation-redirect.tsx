"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function LegacyConfirmationRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code")?.trim();
    const token = params.get("token")?.trim();
    if (code && token) {
      router.replace(
        `/order/${encodeURIComponent(code)}?token=${encodeURIComponent(token)}`,
      );
      return;
    }
    router.replace("/track");
  }, [params, router]);

  return (
    <main className="px-4 py-10 text-center text-sm text-muted">
      Redirecting…
    </main>
  );
}
