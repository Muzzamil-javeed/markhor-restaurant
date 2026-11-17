import type { Metadata } from "next";
import { OrdersBoard } from "@/components/admin/orders-board";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return <OrdersBoard />;
}
