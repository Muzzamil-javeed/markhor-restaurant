export type Variant = { id: string; label: string; price: number };

/** Paid add-on. */
export type Option = { id: string; label: string; price: number };

export type Choice = { id: string; label: string; price: number };

export type ChoiceGroup = {
  id: string;
  label: string;
  required: boolean;
  min: number;
  max: number;
  choices: Choice[];
};

export type MenuTag = "spicy" | "signature" | "new" | "smoked";

export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  /** Base price in whole rupees. Lowest variant price when variants exist. */
  price: number;
  /** Pick exactly one. */
  variants?: Variant[];
  /** For example, a required sauce. */
  choiceGroups?: ChoiceGroup[];
  /** Optional paid extras. */
  addOns?: Option[];
  tags?: MenuTag[];
  available: boolean;
};

export type Category = {
  id: string;
  name: string;
  items: MenuItem[];
};
