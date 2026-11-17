import type { Metadata } from "next";
import { CancelledOrdersTable } from "@/components/admin/cancelled-orders-table";

export const metadata: Metadata = {
  title: "Cancelled orders",
};

export default function AdminCancelledOrdersPage() {
  return <CancelledOrdersTable />;
}
