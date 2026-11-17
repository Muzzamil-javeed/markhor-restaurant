import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KitchenTicket } from "@/components/admin/kitchen-ticket";
import { PrintButton } from "@/components/admin/print-button";
import { getAdminOrderById } from "@/lib/admin-orders";

type Props = {
  params: Promise<{ id: string }>;
};

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  return {
    title: order ? `Ticket ${order.code}` : "Ticket",
  };
}

export default async function AdminOrderTicketPage({ params }: Props) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div className="print:m-0 print:bg-white print:p-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="font-heading text-xl font-semibold text-ink">
            Kitchen ticket · {order.code}
          </h1>
          <p className="text-sm text-muted">80mm thermal-friendly layout.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/orders"
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium"
          >
            Back
          </Link>
          <PrintButton />
        </div>
      </div>
      <KitchenTicket order={order} />
      <style>{`
        @media print {
          @page { size: 80mm auto; margin: 4mm; }
          body { background: white !important; }
          header { display: none !important; }
          .print\\:hidden { display: none !important; }
          .ticket { width: 72mm !important; max-width: 72mm !important; }
        }
      `}</style>
    </div>
  );
}
