import type { Metadata } from "next";
import { CompletedOrdersTable } from "@/components/admin/completed-orders-table";

export const metadata: Metadata = {
  title: "Completed orders",
};

export default function AdminCompletedOrdersPage() {
  return <CompletedOrdersTable />;
}
