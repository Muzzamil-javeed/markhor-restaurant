export function MenuSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6" aria-hidden>
      <div className="mb-4 h-9 w-48 animate-pulse rounded-xl bg-line/80" />
      <div className="mb-3 h-4 w-72 animate-pulse rounded bg-line/70" />
      <div className="mb-4 h-11 animate-pulse rounded-2xl bg-line/70" />
      <div className="mb-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-line/70"
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-line bg-white"
          >
            <div className="aspect-[5/3] animate-pulse bg-line/80" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-line/80" />
              <div className="h-3 w-full animate-pulse rounded bg-line/60" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-line/60" />
              <div className="mt-2 h-10 animate-pulse rounded-xl bg-line/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
