/** Strip control characters and trim for free-text fields. */
export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** Safe log fragment — never include phone, email, or address. */
export function safeOrderLog(input: {
  code: string;
  orderType?: string;
  total?: number;
}): string {
  return [
    input.code,
    input.orderType,
    typeof input.total === "number" ? `total=${input.total}` : null,
  ]
    .filter(Boolean)
    .join(" ");
}
