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
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function fieldClassName(error?: boolean) {
  return cn(
    "h-11 w-full rounded-xl border bg-white px-3 text-sm text-ink outline-none transition-colors",
    "placeholder:text-muted focus-visible:ring-2",
    error
      ? "border-destructive/60 focus-visible:ring-destructive/30"
      : "border-line focus-visible:ring-brand/40",
  );
}

export function textareaClassName(error?: boolean) {
  return cn(
    "min-h-[4.5rem] w-full rounded-xl border bg-white px-3 py-2 text-sm text-ink outline-none transition-colors",
    "placeholder:text-muted focus-visible:ring-2",
    error
      ? "border-destructive/60 focus-visible:ring-destructive/30"
      : "border-line focus-visible:ring-brand/40",
  );
}
