import sharp from "sharp";

const BRAND = { r: 94, g: 15, b: 29 };

/** Mean luminance 0–255 from a buffer (resized sample). */
export async function meanLuminance(input: Buffer): Promise<number> {
  const { data, info } = await sharp(input)
    .rotate()
    .resize(64, 64, { fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let sum = 0;
  const pixels = info.width * info.height;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    sum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  return sum / pixels;
}

/**
 * Dark smokehouse grade: slight underexposure, contrast, warm maroon multiply,
 * vignette, fine grain. Keeps dish readable.
 */
export async function applyDarkGrade(
  input: Buffer,
  opts?: { width?: number; height?: number; square?: boolean },
): Promise<Buffer> {
  const width = opts?.width ?? 1600;
  const height = opts?.height ?? 1067;

  const pipeline = sharp(input)
    .rotate()
    .resize(width, height, {
      fit: "cover",
      position: "attention",
    });

  // Softer grade — warm, not crushed black
  const base = await pipeline
    .modulate({ brightness: 1.04, saturation: 1.05 })
    .linear(1.04, -2)
    .toBuffer();

  const { width: w, height: h } = await sharp(base).metadata();
  const W = w ?? width;
  const H = h ?? height;

  const overlay = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { ...BRAND, alpha: 0.045 },
    },
  })
    .png()
    .toBuffer();

  const vignetteSvg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="42%" r="78%">
          <stop offset="62%" stop-color="black" stop-opacity="0"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.22"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`,
  );

  const noise = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
            <filter id="n">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.035 0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#n)"/>
          </svg>`,
        ),
        blend: "over",
      },
    ])
    .png()
    .toBuffer();

  return sharp(base)
    .composite([
      { input: overlay, blend: "multiply" },
      { input: vignetteSvg, blend: "over" },
      { input: noise, blend: "overlay" },
    ])
    .webp({ quality: 82 })
    .toBuffer();
}

export async function toBlurPlaceholder(input: Buffer): Promise<string> {
  const buf = await sharp(input)
    .resize(16, 10, { fit: "cover" })
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}
