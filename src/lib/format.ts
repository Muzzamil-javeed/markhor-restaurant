const pkr = new Intl.NumberFormat("en-PK", {
  numberingSystem: "latn",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Format integer rupees as `Rs. 1,210`. */
export function formatPKR(rupees: number): string {
  return `Rs. ${pkr.format(Math.round(rupees))}`;
}
