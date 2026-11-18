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
    const isLogin = pathname.startsWith("/admin/login");
    const tone = isLogin ? "#140D0E" : "#f3eee9";
    html.style.backgroundColor = tone;
    document.body.style.backgroundColor = tone;
    return () => {
      html.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
  }, [pathname]);

  if (pathname.startsWith("/admin/login")) {
    return (
      <div className="min-h-dvh bg-[#140D0E] text-cream">{children}</div>
    );
  }
  return <AdminShell>{children}</AdminShell>;
}
