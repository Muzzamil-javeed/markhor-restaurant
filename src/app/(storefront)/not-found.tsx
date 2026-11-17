import { TransitionLink } from "@/components/transition/TransitionLink";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-start justify-center gap-4 px-4 py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
        404
      </p>
      <h1 className="font-heading text-3xl font-semibold text-ink">
        Page not found
      </h1>
      <p className="text-sm text-muted">
        That link does not exist. Head back to the menu and keep ordering.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <TransitionLink
          href="/menu"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-on-brand"
        >
          Browse menu
        </TransitionLink>
        <TransitionLink
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink"
        >
          Home
        </TransitionLink>
      </div>
    </main>
  );
}

