"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";

function LoginFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      const next = params.get("next") || "/admin/orders";
      router.replace(next.startsWith("/admin") ? next : "/admin/orders");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="rounded-[1.75rem] border border-cream/15 bg-[#1a1212]/80 p-5 shadow-[0_24px_60px_rgba(10,5,6,0.45)] backdrop-blur-md sm:p-6"
    >
      <label
        htmlFor="admin-password"
        className="font-eyebrow text-[10px] font-semibold tracking-[0.16em] text-cream/55 uppercase"
      >
        Kitchen password
      </label>
      <div className="relative mt-2.5">
        <LockKeyhole
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-cream/40"
          aria-hidden
        />
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="••••••••"
          className="h-12 w-full rounded-full border border-cream/20 bg-cream/5 pr-4 pl-11 text-sm text-cream outline-none placeholder:text-cream/30 focus-visible:ring-2 focus-visible:ring-[#e87830]/45"
        />
      </div>
      {error ? (
        <p className="mt-3 text-sm text-[#f0b4b4]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="ui-press mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-on-brand shadow-[0_12px_28px_rgba(94,15,29,0.45)] transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function AdminLoginForm() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-cream/55">Loading…</p>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
