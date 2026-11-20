import type { Metadata } from "next";
import { RevenueHistoryPanel } from "@/components/admin/revenue-history";

export const metadata: Metadata = {
  title: "Daily revenue",
};

export default function AdminRevenuePage() {
  return <RevenueHistoryPanel />;
}
