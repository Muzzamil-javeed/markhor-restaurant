"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

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
      className="rounded-2xl border border-line bg-white p-5"
    >
      <label htmlFor="admin-password" className="text-sm font-medium text-ink">
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        className="mt-1.5 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      />
      {error ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand text-sm font-semibold text-on-brand disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function AdminLoginForm() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <LoginFormInner />
    </Suspense>
  );
}
