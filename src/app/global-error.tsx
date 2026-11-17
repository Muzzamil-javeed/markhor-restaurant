"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-start justify-center gap-4 bg-[#F6F4F2] px-4 text-[#241A1B]">
        <h1 className="text-2xl font-semibold">Markhor could not load</h1>
        <p className="text-sm text-[#74696B]">
          Please refresh. Your cart stays in this browser.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-2xl bg-[#5E0F1D] px-5 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
