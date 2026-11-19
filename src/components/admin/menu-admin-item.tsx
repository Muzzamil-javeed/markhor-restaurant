"use client";

import Image from "next/image";
import {
  Eye,
  ImagePlus,
  Loader2,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/cn";
import type {
  MenuAdminItem,
  MenuAdminViewMode,
} from "@/components/admin/menu-admin-types";

type Props = {
  item: MenuAdminItem;
  layout: MenuAdminViewMode;
  busy: boolean;
  uploading: boolean;
  uploadPreview: string | null;
  uploadLocked: boolean;
  onView: () => void;
  onToggleAvailable: () => void;
  onPickPhoto: (file: File) => void;
  onUseStock: () => void;
  onEdit: () => void;
  onRestore: () => void;
  onDelete: () => void;
};

export function MenuAdminItem({
  item,
  layout,
  busy,
  uploading,
  uploadPreview,
  uploadLocked,
  onView,
  onToggleAvailable,
  onPickPhoto,
  onUseStock,
  onEdit,
  onRestore,
  onDelete,
}: Props) {
  const effective = item.priceOverride ?? item.basePrice;
  const isCard = layout === "card";
  const src =
    uploading && uploadPreview ? uploadPreview : item.previewImage;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        isCard
          ? "flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_24px_rgba(36,26,27,0.05)]"
          : "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        item.hidden && (isCard ? "opacity-75" : "bg-[#faf7f5] opacity-75"),
      )}
    >
      <div
        className={cn(
          "flex min-w-0",
          isCard ? "flex-col" : "items-center gap-3",
        )}
      >
        <div
          className={cn(
            "group relative shrink-0 overflow-hidden border border-line bg-[#1a0c0e]",
            isCard
              ? "aspect-[16/10] w-full rounded-none border-x-0 border-t-0"
              : "size-14 rounded-xl",
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            unoptimized={Boolean(uploading && uploadPreview)}
            className={cn(
              "object-cover transition-opacity duration-300",
              uploading && "opacity-50",
            )}
            sizes={isCard ? "(max-width: 640px) 100vw, 33vw" : "56px"}
          />
          {uploading ? (
            <div
              className="absolute inset-0 flex items-center justify-center bg-ink/45"
              aria-hidden
            >
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          ) : (
            <button
              type="button"
              onClick={onView}
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors hover:bg-ink/45 focus-visible:bg-ink/45 focus-visible:outline-none",
                isCard
                  ? "opacity-100"
                  : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
              )}
              aria-label={`View full photo of ${item.name}`}
            >
              <Eye
                className="size-5 text-white drop-shadow-md sm:size-4"
                aria-hidden
              />
            </button>
          )}
        </div>

        <div className={cn("min-w-0", isCard && "px-4 pt-3")}>
          <p className="truncate font-medium text-ink">
            {item.name}
            {item.isCustom ? (
              <span className="ml-2 text-[10px] font-semibold tracking-wide text-brand uppercase">
                New
              </span>
            ) : null}
          </p>
          <p className="text-xs text-muted">
            {item.categoryName} · {formatPKR(effective)}
            {item.priceOverride != null ? " (override)" : ""}
            {item.hidden ? " · Hidden" : ""}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          isCard && "px-4 pt-3 pb-4",
        )}
      >
        <label className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-medium">
          <span
            className={
              item.available && !item.hidden ? "text-ink" : "text-destructive"
            }
          >
            {item.hidden
              ? "Hidden"
              : item.available
                ? "Available"
                : "Sold out"}
          </span>
          <input
            type="checkbox"
            checked={item.available && !item.hidden}
            disabled={busy || item.hidden}
            onChange={onToggleAvailable}
            className="size-4 rounded border-line text-brand"
            aria-label={`Toggle availability for ${item.name}`}
          />
        </label>

        <label
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink hover:bg-tint",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="size-3.5" aria-hidden />
          )}
          {uploading ? "Uploading…" : item.imagePath ? "Replace" : "Photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={busy || uploadLocked}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onPickPhoto(file);
              event.target.value = "";
            }}
          />
        </label>

        {item.imagePath ? (
          <button
            type="button"
            disabled={busy}
            onClick={onUseStock}
            className="inline-flex h-9 items-center rounded-full border border-line px-3 text-xs font-semibold text-muted hover:bg-tint"
          >
            Use stock
          </button>
        ) : null}

        <button
          type="button"
          disabled={busy}
          onClick={onEdit}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink hover:bg-tint"
        >
          <Pencil className="size-3.5" aria-hidden />
          Edit
        </button>

        {item.hidden ? (
          <button
            type="button"
            disabled={busy}
            onClick={onRestore}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink hover:bg-tint"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Restore
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-destructive/35 px-3 text-xs font-semibold text-destructive hover:bg-destructive/5"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Delete
          </button>
        )}
      </div>
    </motion.li>
  );
}
