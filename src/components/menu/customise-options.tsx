"use client";

import type { MenuItem } from "@/data/menu-types";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { ItemSelection, SelectionErrors } from "@/lib/pricing";
import { toggleAddOn, toggleChoice } from "@/lib/pricing";

type CustomiseOptionsProps = {
  item: MenuItem;
  selection: ItemSelection;
  errors: SelectionErrors;
  showErrors: boolean;
  onChange: (next: ItemSelection) => void;
};

export function CustomiseOptions({
  item,
  selection,
  errors,
  showErrors,
  onChange,
}: CustomiseOptionsProps) {
  return (
    <div className="flex flex-col gap-6">
      {item.variants?.length ? (
        <fieldset>
          <legend className="font-heading text-sm font-semibold text-ink">
            Choose one
          </legend>
          <div className="mt-3 flex flex-col gap-2">
            {item.variants.map((variant) => {
              const checked = selection.variantId === variant.id;
              return (
                <label
                  key={variant.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-3 text-sm",
                    checked
                      ? "border-brand bg-tint/50"
                      : "border-line bg-white hover:border-brand/30",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`variant-${item.id}`}
                      checked={checked}
                      onChange={() =>
                        onChange({ ...selection, variantId: variant.id })
                      }
                      className="size-4 accent-[var(--brand)]"
                    />
                    {variant.label}
                  </span>
                  <span className="tabular-nums text-muted">
                    {formatPKR(variant.price)}
                  </span>
                </label>
              );
            })}
          </div>
          {showErrors && errors.variant ? (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {errors.variant}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {item.choiceGroups?.map((group) => {
        const multi = group.max > 1;
        return (
          <fieldset key={group.id}>
            <legend className="font-heading text-sm font-semibold text-ink">
              {group.label}
              {group.required ? (
                <span className="ml-1 font-normal text-muted">(required)</span>
              ) : null}
            </legend>
            <div className="mt-3 flex flex-col gap-2">
              {group.choices.map((choice) => {
                const checked = selection.choiceIds.includes(choice.id);
                return (
                  <label
                    key={choice.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-3 text-sm",
                      checked
                        ? "border-brand bg-tint/50"
                        : "border-line bg-white hover:border-brand/30",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type={multi ? "checkbox" : "radio"}
                        name={multi ? undefined : `group-${group.id}`}
                        checked={checked}
                        onChange={() =>
                          onChange(
                            toggleChoice(item, selection, group.id, choice.id),
                          )
                        }
                        className="size-4 accent-[var(--brand)]"
                      />
                      {choice.label}
                    </span>
                    <span className="tabular-nums text-muted">
                      {choice.price > 0
                        ? `+${formatPKR(choice.price)}`
                        : "Included"}
                    </span>
                  </label>
                );
              })}
            </div>
            {showErrors && errors.groups[group.id] ? (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.groups[group.id]}
              </p>
            ) : null}
          </fieldset>
        );
      })}

      {item.addOns?.length ? (
        <fieldset>
          <legend className="font-heading text-sm font-semibold text-ink">
            Add-ons
          </legend>
          <div className="mt-3 flex flex-col gap-2">
            {item.addOns.map((addOn) => {
              const checked = selection.addOnIds.includes(addOn.id);
              return (
                <label
                  key={addOn.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-3 text-sm",
                    checked
                      ? "border-brand bg-tint/50"
                      : "border-line bg-white hover:border-brand/30",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onChange(toggleAddOn(selection, addOn.id))
                      }
                      className="size-4 accent-[var(--brand)]"
                    />
                    {addOn.label}
                  </span>
                  <span className="tabular-nums text-muted">
                    {addOn.price > 0 ? `+${formatPKR(addOn.price)}` : "Ask staff"}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}
    </div>
  );
}
