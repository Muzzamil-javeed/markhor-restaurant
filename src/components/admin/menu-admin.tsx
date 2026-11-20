"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { MenuAdminAddDialog } from "@/components/admin/menu-admin-add-dialog";
import { MenuAdminItem } from "@/components/admin/menu-admin-item";
import type {
  MenuAdminItem as MenuAdminItemData,
  MenuAdminViewMode,
} from "@/components/admin/menu-admin-types";
import { cn } from "@/lib/cn";
import { useToastStore } from "@/store/toast";

type CategoryOption = { id: string; name: string };

const VIEW_STORAGE_KEY = "markhor-admin-menu-view";

function readStoredView(): MenuAdminViewMode {
  if (typeof window === "undefined") return "card";
  try {
    const value = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return value === "list" ? "list" : "card";
  } catch {
    return "card";
  }
}

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
  const [items, setItems] = useState<MenuAdminItemData[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<MenuAdminViewMode>("card");
  const [photoFilter, setPhotoFilter] = useState<"all" | "missing" | "uploaded">(
    "all",
  );
  const [matchStyle, setMatchStyle] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [viewing, setViewing] = useState<MenuAdminItemData | null>(null);
  const [editing, setEditing] = useState<MenuAdminItemData | null>(null);
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
      items?: MenuAdminItemData[];
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
      setViewMode(readStoredView());
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  useEffect(() => {
    if (!viewing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewing(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  const setView = (mode: MenuAdminViewMode) => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);
      if (!matchesQuery) return false;
      const uploaded = Boolean(item.imagePath);
      if (photoFilter === "uploaded") return uploaded;
      if (photoFilter === "missing") return !uploaded;
      return true;
    });
  }, [items, query, photoFilter]);

  const openEdit = (item: MenuAdminItemData) => {
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

  const uploadImage = async (item: MenuAdminItemData, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setBusyId(item.id);
    setUploadingId(item.id);
    setUploadPreview(previewUrl);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("matchStyle", matchStyle ? "1" : "0");
      const response = await fetch(`/api/admin/menu/${item.id}/image`, {
        method: "POST",
        body,
      });
      const data = await readJson<{
        error?: string;
        imagePath?: string;
        imageSquarePath?: string;
        imageThumbPath?: string;
      }>(response);
      if (!response.ok) {
        setError(data.error ?? "Image upload failed.");
        showToast(data.error ?? "Image upload failed.");
        return;
      }
      // Instant thumbnail swap (unique path / cache-bust) before list reload.
      if (data.imagePath) {
        setItems((current) =>
          current.map((row) =>
            row.id === item.id
              ? {
                  ...row,
                  imagePath: data.imagePath ?? row.imagePath,
                  previewImage: data.imagePath!,
                }
              : row,
          ),
        );
        setViewing((current) =>
          current?.id === item.id
            ? { ...current, previewImage: data.imagePath!, imagePath: data.imagePath! }
            : current,
        );
      }
      showToast("Photo uploaded — live on the menu.");
      await load();
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploadPreview(null);
      setUploadingId(null);
      setBusyId(null);
    }
  };

  const removeItem = async (item: MenuAdminItemData) => {
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

  const restoreItem = async (item: MenuAdminItemData) => {
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

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or category"
          className="h-11 max-w-md flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          aria-label="Search menu items"
        />
        <label className="inline-flex items-center gap-2 text-xs font-medium text-ink">
          <select
            value={photoFilter}
            onChange={(event) =>
              setPhotoFilter(
                event.target.value as "all" | "missing" | "uploaded",
              )
            }
            className="h-10 rounded-full border border-line bg-white px-3 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="Filter by photo"
          >
            <option value="all">All photos</option>
            <option value="missing">Missing photo</option>
            <option value="uploaded">Uploaded</option>
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-xs font-medium text-ink">
          <input
            type="checkbox"
            checked={matchStyle}
            onChange={(event) => setMatchStyle(event.target.checked)}
            className="size-4 rounded border-line"
          />
          Match site style on upload
        </label>

        <div
          className="ml-auto inline-flex items-center rounded-full border border-line bg-white p-1"
          role="group"
          aria-label="Menu layout"
        >
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              viewMode === "list"
                ? "bg-brand text-on-brand"
                : "text-muted hover:text-ink",
            )}
            aria-pressed={viewMode === "list"}
          >
            <List className="size-3.5" aria-hidden />
            List
          </button>
          <button
            type="button"
            onClick={() => setView("card")}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              viewMode === "card"
                ? "bg-brand text-on-brand"
                : "text-muted hover:text-ink",
            )}
            aria-pressed={viewMode === "card"}
          >
            <LayoutGrid className="size-3.5" aria-hidden />
            Cards
          </button>
        </div>
      </div>

      {error ? (
        <p
          className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <LayoutGroup>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul
              className={cn(
                viewMode === "card"
                  ? "grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                  : "divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white",
              )}
            >
              <AnimatePresence initial={false}>
                {filtered.map((item) => (
                  <MenuAdminItem
                    key={`${viewMode}-${item.id}`}
                    item={item}
                    layout={viewMode}
                    busy={busyId === item.id}
                    uploading={uploadingId === item.id}
                    uploadPreview={uploadPreview}
                    uploadLocked={Boolean(uploadingId)}
                    onView={() => setViewing(item)}
                    onToggleAvailable={async () => {
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
                    onPickPhoto={(file) => void uploadImage(item, file)}
                    onEdit={() => openEdit(item)}
                    onRestore={() => void restoreItem(item)}
                    onDelete={() => void removeItem(item)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>

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

      {viewing ? (
        <div
          className="animate-overlay-in fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-[3px]"
          role="dialog"
          aria-modal="true"
          aria-label={`Full photo — ${viewing.name}`}
          onClick={() => setViewing(null)}
        >
          <button
            type="button"
            onClick={() => setViewing(null)}
            className="absolute top-4 right-4 z-[1] inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close full photo"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div
            className="animate-pop-in relative flex max-h-[min(90vh,920px)] w-full max-w-3xl flex-col items-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-square w-full max-h-[min(82vh,860px)] overflow-hidden rounded-2xl border border-white/20 bg-[#1a0c0e] shadow-2xl">
              <Image
                src={viewing.previewImage}
                alt={viewing.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            <p className="text-center text-sm font-medium text-white/90">
              {viewing.name}
            </p>
          </div>
        </div>
      ) : null}

      {uploadingId ? (
        <div
          className="animate-overlay-in fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[3px]"
          role="alert"
          aria-live="assertive"
          aria-busy="true"
        >
          <div className="animate-pop-in flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-line bg-white px-8 py-8 shadow-xl">
            <div className="relative flex size-14 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full border-2 border-brand/15"
                aria-hidden
              />
              <Loader2
                className="size-8 animate-spin text-brand"
                aria-hidden
              />
            </div>
            <div className="text-center">
              <p className="font-heading text-sm font-semibold text-ink">
                Uploading photo…
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Processing and matching site style. Please wait.
              </p>
            </div>
            <div
              className="relative h-1 w-full overflow-hidden rounded-full bg-line"
              aria-hidden
            >
              <div className="absolute inset-y-0 w-2/5 animate-[admin-upload-bar_1.15s_ease-in-out_infinite] rounded-full bg-brand" />
            </div>
          </div>
        </div>
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
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-on-brand disabled:opacity-50"
              >
                {busyId === editing.id ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
