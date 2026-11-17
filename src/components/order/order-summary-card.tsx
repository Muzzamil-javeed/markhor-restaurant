import { site } from "@/data/site";
import { formatPKR } from "@/lib/format";
import type { PublicOrder } from "@/lib/order-public";
import { orderTypeLabels } from "@/store/cart";

export function OrderSummaryCard({ order }: { order: PublicOrder }) {
  return (
    <div className="rounded-2xl border border-line bg-white px-4 py-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-heading text-sm font-semibold text-ink">
          {orderTypeLabels[order.orderType]} · {order.etaLabel}
        </p>
        {order.voucherCode ? (
          <span className="text-xs font-medium text-brand">
            {order.voucherCode}
          </span>
        ) : null}
      </div>

      <OrderTypeDetails order={order} />

      <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-3">
        {order.items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <span>
              <span className="font-medium text-ink">
                {item.quantity}× {item.name}
              </span>
              {item.summary ? (
                <span className="mt-0.5 block text-xs text-muted">
                  {item.summary}
                </span>
              ) : null}
              {item.note ? (
                <span className="mt-0.5 block text-xs italic text-muted">
                  Note: {item.note}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 tabular-nums">
              {formatPKR(item.lineTotal)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-sm">
        <Row label="Subtotal" value={formatPKR(order.subtotal)} />
        {order.discount > 0 ? (
          <Row label="Voucher" value={`−${formatPKR(order.discount)}`} />
        ) : null}
        <Row label="GST" value={formatPKR(order.gst)} />
        {order.orderType === "delivery" ? (
          <Row
            label="Delivery"
            value={
              order.deliveryFee === 0
                ? "Free"
                : formatPKR(order.deliveryFee)
            }
          />
        ) : null}
        <div className="mt-1 flex justify-between gap-3 font-heading font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPKR(order.total)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted">{site.footer.note}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums text-ink">{value}</dd>
    </div>
  );
}

function OrderTypeDetails({ order }: { order: PublicOrder }) {
  if (order.orderType === "delivery") {
    return (
      <div className="text-sm text-muted">
        <p>
          Deliver to{" "}
          <span className="text-ink">{order.customerName}</span>
        </p>
        {order.address ? <p className="mt-0.5">{order.address}</p> : null}
        {order.areaLandmark ? (
          <p className="mt-0.5">Near {order.areaLandmark}</p>
        ) : null}
      </div>
    );
  }

  if (order.orderType === "pickup") {
    return (
      <p className="text-sm text-muted">
        Pickup for <span className="text-ink">{order.customerName}</span>
      </p>
    );
  }

  return (
    <div className="text-sm text-muted">
      <p>
        Dine-in for <span className="text-ink">{order.customerName}</span>
      </p>
      {order.tableNumber ? (
        <p className="mt-0.5">Table {order.tableNumber}</p>
      ) : null}
      {order.partySize ? (
        <p className="mt-0.5">Party of {order.partySize}</p>
      ) : null}
    </div>
  );
}
