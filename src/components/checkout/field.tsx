import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-ink"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const fieldClassName = cn(
  "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none",
  "placeholder:text-muted focus-visible:ring-2 focus-visible:ring-brand/40",
);

export const textareaClassName = cn(
  "min-h-24 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none",
  "placeholder:text-muted focus-visible:ring-2 focus-visible:ring-brand/40",
);
