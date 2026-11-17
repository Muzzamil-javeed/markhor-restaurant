"use client";

type CategoryOption = { id: string; name: string };

type Props = {
  categories: CategoryOption[];
  name: string;
  price: string;
  categoryId: string;
  available: boolean;
  busy: boolean;
  onName: (value: string) => void;
  onPrice: (value: string) => void;
  onCategoryId: (value: string) => void;
  onAvailable: (value: boolean) => void;
  onClose: () => void;
  onSave: () => void;
};

export function MenuAdminAddDialog({
  categories,
  name,
  price,
  categoryId,
  available,
  busy,
  onName,
  onPrice,
  onCategoryId,
  onAvailable,
  onClose,
  onSave,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-add-title"
        className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-xl"
      >
        <h2
          id="menu-add-title"
          className="font-heading text-lg font-semibold text-ink"
        >
          Add new dish
        </h2>
        <p className="mt-1 text-xs text-muted">
          Shows on the front menu after you save.
        </p>

        <label className="mt-4 block text-xs font-medium text-ink">
          Dish name
          <input
            value={name}
            onChange={(event) => onName(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            placeholder="e.g. Smoked chicken platter"
          />
        </label>

        <label className="mt-3 block text-xs font-medium text-ink">
          Category
          <select
            value={categoryId}
            onChange={(event) => onCategoryId(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-3 block text-xs font-medium text-ink">
          Price (Rs.)
          <input
            inputMode="numeric"
            value={price}
            onChange={(event) => onPrice(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            placeholder="1210"
          />
        </label>

        <label className="mt-3 inline-flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={available}
            onChange={(event) => onAvailable(event.target.checked)}
            className="size-4 rounded border-line text-brand"
          />
          Available on front menu
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full border border-line px-4 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onSave}
            className="h-10 rounded-full bg-brand px-4 text-sm font-semibold text-on-brand disabled:opacity-50"
          >
            Add dish
          </button>
        </div>
      </div>
    </div>
  );
}
