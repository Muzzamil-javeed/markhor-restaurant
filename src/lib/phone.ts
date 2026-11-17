import { site } from "@/data/site";

/** Digits-only international number for tel: and WhatsApp links. */
export function phoneDigits(
  phone: string = process.env.NEXT_PUBLIC_RESTAURANT_PHONE ?? site.phone,
): string {
  return phone.replace(/\D/g, "");
}

export function telHref(
  phone: string = process.env.NEXT_PUBLIC_RESTAURANT_PHONE ?? site.phone,
): string {
  return `tel:+${phoneDigits(phone)}`;
}

/** Always show the human-readable Markhor number. */
export function displayPhone(): string {
  return site.phone;
}
