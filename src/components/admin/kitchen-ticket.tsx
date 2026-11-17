import Image from "next/image";
import type { AdminOrder } from "@/lib/admin-orders";
import { formatPKR } from "@/lib/format";
import { orderTypeLabels } from "@/store/cart";

export function KitchenTicket({ order }: { order: AdminOrder }) {
  return (
    <div className="ticket mx-auto w-[80mm] max-w-full border-2 border-dashed border-black/45 bg-white p-3 text-black">
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center overflow-hidden rounded-full border border-dashed border-black/35 bg-white">
          <Image
            src="/logo.png"
            alt="Markhor"
            width={44}
            height={44}
            className="size-11 object-contain"
            priority
          />
        </div>
        <p className="mt-2 text-[11px] tracking-[0.22em] uppercase">Markhor</p>
        <h1 className="mt-1 text-xl font-bold">{order.code}</h1>
        <p className="text-sm">
          {orderTypeLabels[order.orderType]} · {order.etaLabel}
        </p>
      </div>

      <hr className="my-3 border-dashed border-black/40" />

      <p className="text-sm font-semibold">{order.customerName}</p>
      <p className="text-sm">{order.phone}</p>
      {order.address ? (
        <p className="mt-1 text-sm">
          {order.address}
          {order.areaLandmark ? ` · ${order.areaLandmark}` : ""}
        </p>
      ) : null}
      {order.tableNumber ? (
        <p className="mt-1 text-sm">Table {order.tableNumber}</p>
      ) : null}

      <hr className="my-3 border-dashed border-black/40" />

      <ul className="space-y-2 text-sm">
        {order.items.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            <div className="flex justify-between gap-2 font-semibold">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span>{formatPKR(item.lineTotal)}</span>
            </div>
            {item.summary ? (
              <p className="text-xs opacity-80">{item.summary}</p>
            ) : null}
            {item.note ? (
              <p className="text-xs italic">Note: {item.note}</p>
            ) : null}
          </li>
        ))}
      </ul>

      {order.note ? (
        <>
          <hr className="my-3 border-dashed border-black/40" />
          <p className="text-sm font-semibold">Order note</p>
          <p className="text-sm">{order.note}</p>
        </>
      ) : null}

      <hr className="my-3 border-dashed border-black/40" />

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPKR(order.subtotal)}</span>
        </div>
        {order.discount > 0 ? (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>−{formatPKR(order.discount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span>GST</span>
          <span>{formatPKR(order.gst)}</span>
        </div>
        {order.deliveryFee > 0 ? (
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{formatPKR(order.deliveryFee)}</span>
          </div>
        ) : null}
        <div className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span>{formatPKR(order.total)}</span>
        </div>
        <p className="pt-1 text-xs">Pay: {order.paymentMethod}</p>
      </div>
    </div>
  );
}
