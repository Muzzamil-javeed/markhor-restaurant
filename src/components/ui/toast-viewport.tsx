"use client";

import { useToastStore } from "@/store/toast";

export function ToastViewport() {
  const message = useToastStore((state) => state.message);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8"
      aria-live="polite"
      aria-atomic="true"
    >
      {message ? (
        <p
          key={message}
          className="animate-toast-in rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-on-brand shadow-lg"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
