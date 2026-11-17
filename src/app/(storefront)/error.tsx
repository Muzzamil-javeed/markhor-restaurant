"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-start justify-center gap-4 px-4 py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
        Something went wrong
      </p>
      <h1 className="font-heading text-3xl font-semibold text-ink">
        We hit a snag
      </h1>
      <p className="text-sm text-muted">
        Your cart is still saved on this device. Try again, or refresh the page.
      </p>
      {error.digest ? (
        <p className="text-xs text-muted">Ref: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-on-brand"
      >
        Try again
      </button>
    </main>
  );
}
