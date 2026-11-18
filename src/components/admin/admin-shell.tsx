"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Ban,
  CheckCircle2,
  ClipboardList,
  LogOut,
  UtensilsCrossed,
} from "lucide-react";
import { ToastViewport } from "@/components/ui/toast-viewport";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin/orders", label: "Orders", Icon: ClipboardList },
  { href: "/admin/orders/completed", label: "Completed", Icon: CheckCircle2 },
  { href: "/admin/orders/cancelled", label: "Cancelled", Icon: Ban },
  { href: "/admin/menu", label: "Menu", Icon: UtensilsCrossed },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin/orders/cancelled") {
    return pathname.startsWith("/admin/orders/cancelled");
  }
  if (href === "/admin/orders/completed") {
    return pathname.startsWith("/admin/orders/completed");
  }
  if (href === "/admin/orders") {
    return (
      pathname === "/admin/orders" ||
      (pathname.startsWith("/admin/orders/") &&
        !pathname.startsWith("/admin/orders/cancelled") &&
        !pathname.startsWith("/admin/orders/completed"))
    );
  }
  return pathname.startsWith(href);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#f3eee9] text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(94,15,29,0.05),transparent_55%),linear-gradient(180deg,#f7f2ee_0%,#f3eee9_40%,#efe8e2_100%)]"
      />
      <header className="sticky top-0 z-30 border-b border-line/80 bg-[#f3eee9]/90 shadow-[0_8px_24px_rgba(36,26,27,0.04)] backdrop-blur-md">
        <div className="relative flex h-14 w-full items-center gap-3 px-4 sm:px-6">
          <Link
            href="/admin/orders"
            className="inline-flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border border-brand/20 bg-white shadow-sm">
              <Image
                src="/logo.png"
                alt=""
                width={24}
                height={24}
                className="size-6 object-contain"
              />
            </span>
            <span className="font-heading text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              Markhor Staff
            </span>
          </Link>

          <nav
            className="ml-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Admin"
          >
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              const Icon = link.Icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                    active
                      ? "bg-brand text-on-brand shadow-[0_6px_14px_rgba(94,15,29,0.22)]"
                      : "text-ink/75 hover:bg-white/90 hover:text-ink",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => void logout()}
            className="ml-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm font-medium shadow-sm transition-colors hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <LogOut className="size-3.5" aria-hidden />
            Log out
          </button>
        </div>
      </header>

      <div className="relative w-full flex-1 px-4 py-5 sm:px-6">{children}</div>
      <ToastViewport />
    </div>
  );
}
