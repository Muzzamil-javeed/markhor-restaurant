import type { MenuItem } from "@/data/menu-types";

export {
  computeCartTotals,
  linesSubtotal,
  type CartLineTotalsInput,
  type CartTotals,
} from "@/lib/cart-totals";
export {
  applyVoucherCode,
  normaliseVoucherCode,
  type OrderType,
  type VoucherResult,
} from "@/lib/vouchers";


export type ItemSelection = {
  variantId: string | null;
  /** Flat list of selected choice ids across all groups. */
  choiceIds: string[];
  addOnIds: string[];
  note: string;
  quantity: number;
};

export type SelectionErrors = {
  variant?: string;
  groups: Record<string, string>;
  quantity?: string;
  note?: string;
};

export function createDefaultSelection(item: MenuItem): ItemSelection {
  return {
    variantId: item.variants?.[0]?.id ?? null,
    choiceIds: [],
    addOnIds: [],
    note: "",
    quantity: 1,
  };
}

export function unitPrice(item: MenuItem, selection: ItemSelection): number {
  let total = item.price;

  if (item.variants?.length) {
    const variant = item.variants.find((entry) => entry.id === selection.variantId);
    total = variant?.price ?? item.price;
  }

  for (const group of item.choiceGroups ?? []) {
    for (const choice of group.choices) {
      if (selection.choiceIds.includes(choice.id)) {
        total += choice.price;
      }
    }
  }

  for (const addOn of item.addOns ?? []) {
    if (selection.addOnIds.includes(addOn.id)) {
      total += addOn.price;
    }
  }

  return total;
}

/** Pure line total in whole rupees. */
export function lineTotal(
  item: MenuItem,
  selection: ItemSelection,
  qty: number = selection.quantity,
): number {
  return unitPrice(item, selection) * qty;
}

export function buildLineKey(
  itemId: string,
  selection: Pick<
    ItemSelection,
    "variantId" | "choiceIds" | "addOnIds" | "note"
  >,
): string {
  const variantId = selection.variantId ?? "";
  const choices = [...selection.choiceIds].sort().join(",");
  const addOns = [...selection.addOnIds].sort().join(",");
  const note = selection.note.trim();
  return [itemId, variantId, choices, addOns, note].join("|");
}

export function selectionSummary(
  item: MenuItem,
  selection: ItemSelection,
): string {
  const parts: string[] = [];

  if (selection.variantId) {
    const variant = item.variants?.find((entry) => entry.id === selection.variantId);
    if (variant) parts.push(variant.label);
  }

  for (const group of item.choiceGroups ?? []) {
    const picked = group.choices.filter((choice) =>
      selection.choiceIds.includes(choice.id),
    );
    if (picked.length) {
      parts.push(`${group.label}: ${picked.map((choice) => choice.label).join(", ")}`);
    }
  }

  for (const addOn of item.addOns ?? []) {
    if (selection.addOnIds.includes(addOn.id)) {
      parts.push(addOn.label);
    }
  }

  return parts.join(" · ");
}

export function validateSelection(
  item: MenuItem,
  selection: ItemSelection,
): SelectionErrors {
  const errors: SelectionErrors = { groups: {} };

  if (item.variants?.length && !selection.variantId) {
    errors.variant = "Please choose a variant.";
  }

  for (const group of item.choiceGroups ?? []) {
    const selectedCount = group.choices.filter((choice) =>
      selection.choiceIds.includes(choice.id),
    ).length;

    if (selectedCount < group.min) {
      errors.groups[group.id] =
        group.max === 1
          ? `Please choose a ${group.label.toLowerCase()}.`
          : `Choose at least ${group.min} ${group.label.toLowerCase()}.`;
    } else if (selectedCount > group.max) {
      errors.groups[group.id] =
        `Choose up to ${group.max} ${group.label.toLowerCase()}.`;
    }
  }

  if (selection.quantity < 1 || selection.quantity > 20) {
    errors.quantity = "Quantity must be between 1 and 20.";
  }

  if (selection.note.length > 200) {
    errors.note = "Keep special instructions under 200 characters.";
  }

  return errors;
}

export function isSelectionValid(
  item: MenuItem,
  selection: ItemSelection,
): boolean {
  const errors = validateSelection(item, selection);
  return (
    !errors.variant &&
    !errors.quantity &&
    !errors.note &&
    Object.keys(errors.groups).length === 0
  );
}

export function toggleChoice(
  item: MenuItem,
  selection: ItemSelection,
  groupId: string,
  choiceId: string,
): ItemSelection {
  const group = item.choiceGroups?.find((entry) => entry.id === groupId);
  if (!group) return selection;

  const groupChoiceIds = new Set(group.choices.map((choice) => choice.id));
  const others = selection.choiceIds.filter((id) => !groupChoiceIds.has(id));
  const selectedInGroup = selection.choiceIds.filter((id) =>
    groupChoiceIds.has(id),
  );

  if (group.max === 1) {
    return {
      ...selection,
      choiceIds: [...others, choiceId],
    };
  }

  if (selectedInGroup.includes(choiceId)) {
    return {
      ...selection,
      choiceIds: [...others, ...selectedInGroup.filter((id) => id !== choiceId)],
    };
  }

  if (selectedInGroup.length >= group.max) {
    return selection;
  }

  return {
    ...selection,
    choiceIds: [...others, ...selectedInGroup, choiceId],
  };
}

export function toggleAddOn(
  selection: ItemSelection,
  addOnId: string,
): ItemSelection {
  if (selection.addOnIds.includes(addOnId)) {
    return {
      ...selection,
      addOnIds: selection.addOnIds.filter((id) => id !== addOnId),
    };
  }
  return {
    ...selection,
    addOnIds: [...selection.addOnIds, addOnId],
  };
}
