"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImagePlus, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { MenuAdminAddDialog } from "@/components/admin/menu-admin-add-dialog";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useToastStore } from "@/store/toast";

type MenuAdminItem = {
  id: string;
  slug: string;
  name: string;
  baseName: string;
  categoryId: string;
  categoryName: string;
  available: boolean;
  hidden: boolean;
  basePrice: number;
  priceOverride: number | null;
  nameOverride: string | null;
  imagePath: string | null;
  previewImage: string;
  isCustom: boolean;
};

type CategoryOption = { id: string; name: string };

async function readJson<T extends { error?: string }>(
  response: Response,
): Promise<T> {
  const text = await response.text();
  if (!text) {
    return { error: response.ok ? undefined : "Empty server response." } as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return {
      error: response.ok
        ? undefined
        : text.slice(0, 160) || "Invalid server response.",
    } as T;
  }
}

export function MenuAdmin() {
  const router = useRouter();
  const showToast = useToastStore((state) => state.show);
  const [items, setItems] = useState<MenuAdminItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MenuAdminItem | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftPrice, setDraftPrice] = useState("");
  const [draftAvailable, setDraftAvailable] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addCategoryId, setAddCategoryId] = useState("");
  const [addAvailable, setAddAvailable] = useState(true);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/menu", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login?next=/admin/menu");
      return;
    }
    const data = await readJson<{
      items?: MenuAdminItem[];
      categories?: CategoryOption[];
      error?: string;
    }>(response);
    if (!response.ok || !data.items) {
      setError(data.error ?? "Could not load menu.");
      return;
    }
    setItems(data.items);
    setCategories(data.categories ?? []);
    setAddCategoryId((current) => current || data.categories?.[0]?.id || "");
    setError(null);
  }, [router]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q),
    );
  }, [items, query]);

  const openEdit = (item: MenuAdminItem) => {
    setEditing(item);
    setDraftName(item.name);
    setDraftPrice(String(item.priceOverride ?? item.basePrice));
    setDraftAvailable(item.available);
  };

  const openAdd = () => {
    setAddName("");
    setAddPrice("");
    setAddAvailable(true);
    setAddCategoryId(categories[0]?.id ?? "");
    setAdding(true);
  };

  const saveNew = async () => {
    const price = Number.parseInt(addPrice, 10);
    if (!addName.trim()) {
      setError("Enter a dish name.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price in whole rupees.");
      return;
    }
    if (!addCategoryId) {
      setError("Pick a category.");
      return;
    }
    setBusyId("new");
    try {
      const response = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName.trim(),
          categoryId: addCategoryId,
          price,
          available: addAvailable,
        }),
      });
      const data = await readJson<{ error?: string }>(response);
      if (!response.ok) {
        setError(data.error ?? "Could not add dish.");
        showToast(data.error ?? "Could not add dish.");
        return;
      }
      showToast("New dish added — live on the front menu.");
      setAdding(false);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    const price = Number.parseInt(draftPrice, 10);
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price in whole rupees.");
      return;
    }
    const trimmed = draftName.trim();
    setBusyId(editing.id);
    try {
      const body = editing.isCustom
        ? {
            name: trimmed || editing.baseName,
            price,
            available: draftAvailable,
            hidden: false,
          }
        : {
            nameOverride:
              !trimmed || trimmed === editing.baseName ? null : trimmed,
            priceOverride: price === editing.basePrice ? null : price,
            available: draftAvailable,
            hidden: false,
          };
      const response = await fetch(`/api/admin/menu/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await readJson<{ error?: string }>(response);
      if (!response.ok) {
        setError(data.error ?? "Could not save.");
        showToast(data.error ?? "Could not save.");
        return;
      }
      showToast("Menu item updated — live on the front.");
      setEditing(null);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const uploadImage = async (item: MenuAdminItem, file: File) => {
    setBusyId(item.id);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch(`/api/admin/menu/${item.id}/image`, {
        method: "POST",
        body,
      });
      const data = await readJson<{ error?: string }>(response);
      if (!response.ok) {
        setError(data.error ?? "Image upload failed.");
        showToast(data.error ?? "Image upload failed.");
        return;
      }
      showToast("Image updated — refresh menu to see it.");
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (item: MenuAdminItem) => {
    if (!window.confirm(`Hide “${item.name}” from the front menu?`)) return;
    setBusyId(item.id);
    try {
      const response = await fetch(`/api/admin/menu/${item.id}`, {
        method: "DELETE",
      });
      const data = await readJson<{ error?: string }>(response);
      if (!response.ok) {
        setError(data.error ?? "Could not delete.");
        showToast(data.error ?? "Could not delete.");
        return;
      }
      showToast("Item hidden from the front menu.");
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const restoreItem = async (item: MenuAdminItem) => {
    setBusyId(item.id);
    try {
      const response = await fetch(`/api/admin/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: false, available: true }),
      });
      const data = await readJson<{ error?: string }>(response);
      if (!response.ok) {
        setError(data.error ?? "Could not restore item.");
        showToast(data.error ?? "Could not restore item.");
        return;
      }
      showToast("Item restored on the front menu.");
      await load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.18em] text-brand uppercase">
            Catalogue
          </p>
          <h1 className="font-display mt-1 text-3xl tracking-tight text-ink uppercase">
            Menu
          </h1>
          <p className="mt-1 text-sm text-muted">
            Add, edit, photo, or hide dishes — changes show on the front menu.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <Plus className="size-4" aria-hidden />
          Add new dish
        </button>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name or category"
        className="h-11 max-w-md rounded-full border border-line bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        aria-label="Search menu items"
      />

      {error ? (
        <p
          className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {filtered.map((item) => {
          const effective = item.priceOverride ?? item.basePrice;
          return (
            <li
              key={item.id}
              className={cn(
                "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                item.hidden && "bg-[#faf7f5] opacity-75",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-line bg-[#1a0c0e]">
                  <Image
                    src={item.previewImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0">
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

              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-medium">
                  <span
                    className={
                      item.available && !item.hidden
                        ? "text-ink"
                        : "text-destructive"
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
                    disabled={busyId === item.id || item.hidden}
                    onChange={async () => {
                      setBusyId(item.id);
                      try {
                        const response = await fetch(
                          `/api/admin/menu/${item.id}`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              available: !item.available,
                            }),
                          },
                        );
                        const data = await readJson<{ error?: string }>(
                          response,
                        );
                        if (!response.ok) {
                          setError(data.error ?? "Could not update.");
                          showToast(data.error ?? "Could not update.");
                          return;
                        }
                        await load();
                      } finally {
                        setBusyId(null);
                      }
                    }}
                    className="size-4 rounded border-line text-brand"
                    aria-label={`Toggle availability for ${item.name}`}
                  />
                </label>

                <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink hover:bg-tint">
                  <ImagePlus className="size-3.5" aria-hidden />
                  Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    disabled={busyId === item.id}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadImage(item, file);
                      event.target.value = "";
                    }}
                  />
                </label>

                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => openEdit(item)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink hover:bg-tint"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Edit
                </button>

                {item.hidden ? (
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => void restoreItem(item)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink hover:bg-tint"
                  >
                    <RotateCcw className="size-3.5" aria-hidden />
                    Restore
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => void removeItem(item)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-destructive/35 px-3 text-xs font-semibold text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Delete
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {adding ? (
        <MenuAdminAddDialog
          categories={categories}
          name={addName}
          price={addPrice}
          categoryId={addCategoryId}
          available={addAvailable}
          busy={busyId === "new"}
          onName={setAddName}
          onPrice={setAddPrice}
          onCategoryId={setAddCategoryId}
          onAvailable={setAddAvailable}
          onClose={() => setAdding(false)}
          onSave={() => void saveNew()}
        />
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-edit-title"
            className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-xl"
          >
            <h2
              id="menu-edit-title"
              className="font-heading text-lg font-semibold text-ink"
            >
              Edit item
            </h2>
            <p className="mt-1 text-xs text-muted">{editing.baseName}</p>

            <label className="mt-4 block text-xs font-medium text-ink">
              Display name
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              />
            </label>

            <label className="mt-3 block text-xs font-medium text-ink">
              Price (Rs.)
              <input
                inputMode="numeric"
                value={draftPrice}
                onChange={(event) => setDraftPrice(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              />
            </label>

            <label className="mt-3 inline-flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={draftAvailable}
                onChange={(event) => setDraftAvailable(event.target.checked)}
                className="size-4 rounded border-line text-brand"
              />
              Available on front menu
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-10 rounded-full border border-line px-4 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === editing.id}
                onClick={() => void saveEdit()}
                className="h-10 rounded-full bg-brand px-4 text-sm font-semibold text-on-brand disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
