/**
 * Optional asset helper for smoke textures.
 *
 * Place dark smoke plates at:
 *   public/images/smoke-1.webp
 *   public/images/smoke-2.webp
 *
 * Suggested sources (credit in CREDITS.md when used):
 *   Pexels — "smoke on black background", "white smoke wisps dark"
 *   Resize to ~1600px wide, WebP, each ≤ 200 KB.
 *
 * Until those files exist, SmokeLayer falls back to
 *   public/images/smoke-1.svg / smoke-2.svg
 * and then to an inline feTurbulence SVG.
 *
 * Usage (manual):
 *   1. Download two smoke images
 *   2. Convert with: npx sharp-cli -i in.jpg -o public/images --format webp --quality 70 resize 1600
 *   3. Name them smoke-1.webp and smoke-2.webp
 */

export const SMOKE_ASSETS = [
  {
    out: "public/images/smoke-1.webp",
    query: "smoke on black background",
    maxBytes: 200_000,
  },
  {
    out: "public/images/smoke-2.webp",
    query: "white smoke wisps dark",
    maxBytes: 200_000,
  },
] as const;

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  console.log("See script header for smoke WebP drop-in instructions.");
  console.log(SMOKE_ASSETS);
}
