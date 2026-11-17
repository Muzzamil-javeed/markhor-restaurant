import type { LucideIcon } from "lucide-react";

export function LegalPageHeader({
  eyebrow,
  title,
  updated,
}: {
  eyebrow: string;
  title: string;
  updated: string;
}) {
  return (
    <header className="border-b border-line pb-6">
      <p className="font-eyebrow text-[10px] font-semibold tracking-[0.18em] text-brand uppercase">
        {eyebrow}
      </p>
      <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-tint text-brand">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="size-3.5"
            aria-hidden
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
        {updated}
      </p>
    </header>
  );
}

export function LegalSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_4px_16px_rgba(36,26,27,0.03)] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
          <Icon className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-semibold text-ink sm:text-xl">
            {title}
          </h2>
          <div className="mt-3 space-y-3 text-base leading-relaxed text-ink/85">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
