"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("mk-ready");
    const prevHtml = html.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    html.style.backgroundColor = "#f3eee9";
    document.body.style.backgroundColor = "#f3eee9";
    return () => {
      html.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
  }, []);

  if (pathname.startsWith("/admin/login")) {
    return (
      <div className="min-h-dvh bg-[#f3eee9] text-ink">{children}</div>
    );
  }
  return <AdminShell>{children}</AdminShell>;
}
