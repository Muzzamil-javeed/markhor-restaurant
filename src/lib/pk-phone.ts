/**
 * Accept 03XXXXXXXXX or +923XXXXXXXXX (and common variants).
 * Normalise to +923XXXXXXXXX.
 */
export function normalisePkPhone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const digits = trimmed.replace(/\D/g, "");

  if (/^03\d{9}$/.test(digits)) {
    return `+92${digits.slice(1)}`;
  }
  if (/^923\d{9}$/.test(digits)) {
    return `+${digits}`;
  }
  // Bare mobile without leading 0: 3XXXXXXXXX
  if (/^3\d{9}$/.test(digits)) {
    return `+92${digits}`;
  }

  return null;
}

export function isValidPkPhone(input: string): boolean {
  return normalisePkPhone(input) !== null;
}
