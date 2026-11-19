export type MenuAdminItem = {
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
  hasStaticPhoto: boolean;
  isCustom: boolean;
};

export type MenuAdminViewMode = "list" | "card";
