# Markhor Restaurant — online ordering

Mobile-first ordering for **Markhor Restaurant** (Markhor Smoked Meat) in DHA Phase 6, Karachi: browse → customise → cart → checkout → confirmation → tracking, plus a staff admin panel.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind · shadcn/ui · Zustand · Prisma 7 · Zod · React Hook Form · Framer Motion.

## Setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed   # optional — admin menu availability flags
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` / `npm start` | Production build + serve |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright full order flow |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:deploy` | Apply migrations (production) |

## Environment variables

Copy `.env.example` → `.env`. Never commit secrets.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Dev: `file:./prisma/dev.db`. Prod: Postgres URL. |
| `ADMIN_PASSWORD` | yes | Kitchen / admin login. |
| `ADMIN_SESSION_SECRET` | yes | HMAC secret for the httpOnly admin cookie. |
| `NEXT_PUBLIC_SITE_URL` | prod | Canonical origin for sitemap, OG, JSON-LD. |
| `NEXT_PUBLIC_RESTAURANT_PHONE` | yes | Display / tel links (`+9233…`). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | yes | Digits only for `wa.me` notify links. |
| `GST_RATE` | yes | Decimal, e.g. `0.15` = 15%. |
| `DELIVERY_FEE` | yes | Whole rupees (integer). |
| `MIN_ORDER_DELIVERY` | yes | Whole rupees; `0` disables. |

## How to edit the menu

Canonical catalogue lives in TypeScript:

1. Edit category files under `src/data/categories/` (starters, burgers, mains, …).
2. Wire categories in `src/data/menu.ts`.
3. Prices are **integer rupees** (e.g. `1210` → `Rs. 1,210`).
4. Helpers in `src/data/menu-build.ts`: `menuItem`, `variants`, `sauceGroup`, `option`.
5. Business rules (pricing, vouchers, hours) stay in `src/lib/` — not in components.

After edits, run `npm test` (menu integrity) and `npm run build`.

Admin can also toggle **availability** at `/admin/menu` (runtime overlay; base prices still come from `src/data`).

## How to add photos

1. Drop a JPG at `public/images/menu/<slug>.jpg` (slug matches the item, e.g. `wings-on-fire.jpg`).
2. Register the slug in `src/data/menu-photos.ts` so `next/image` loads it.
3. Until registered, cards use a fixed-aspect maroon placeholder (no layout shift).

Logo: `public/logo.png` (used in header, favicon, Open Graph).

## Deploy (Vercel + Postgres)

1. Create a Postgres database (Vercel Postgres, Neon, Supabase, etc.).
2. In Vercel project settings, set env vars from the table above:
   - `DATABASE_URL` → Postgres connection string  
   - `NEXT_PUBLIC_SITE_URL` → `https://your-domain.com`  
   - Strong `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`
3. In `prisma/schema.prisma`, switch `provider` from `sqlite` to `postgresql` before production migrate (schema is written Postgres-compatible).
4. Deploy; run migrations on the production DB:

   ```bash
   npm run db:deploy
   ```

5. Confirm `/robots.txt`, `/sitemap.xml`, Home, Menu, checkout, and `/admin/login`.

SQLite is for local development only.

## SEO & performance notes

- Default title/description: **Markhor Menu \| Western Food in DHA Phase 6, Karachi**
- Restaurant + Menu JSON-LD (address, phone, hours) on every page
- Security headers via `next.config.ts`
- Cart persists to `localStorage` (`markhor-cart-v2`) and survives offline / refresh

## Questions for the owner

Please confirm before go-live:

1. **GST rate** — currently `15%` (`GST_RATE=0.15`). Correct for FBR / restaurant sales?
2. **Delivery fee and zones** — flat fee today (`DELIVERY_FEE`). Zones, distance tiers, or free-delivery threshold?
3. **Minimum order** for delivery (`MIN_ORDER_DELIVERY`) — amount and any exceptions?
4. **Extra-meat price on pastrami** — `extra-meat` add-on on Pastrami on rye; confirm rupee amount.
5. **Estimated prep times** — ASAP ETAs by order type (delivery / pickup / dine-in) and peak hours.
6. **Payment gateway** — cash / pay-at-counter only for now; prefer JazzCash, EasyPaisa, bank transfer, or card (Stripe / PayFast)?

## QA

```bash
npm run lint
npm test
npm run build
npx playwright install chromium   # first time only
npm run test:e2e
```

Lighthouse (with `npm run start` after build):

```bash
npm run test:lighthouse
```

Or manually (desktop form factor — required for the photographic full-bleed hero):

```bash
npx lighthouse http://127.0.0.1:3000 --preset=desktop --only-categories=performance --only-categories=accessibility --only-categories=best-practices --only-categories=seo --chrome-flags="--headless --no-sandbox" --quiet
npx lighthouse http://127.0.0.1:3000/menu --preset=desktop --only-categories=performance --only-categories=accessibility --only-categories=best-practices --only-categories=seo --chrome-flags="--headless --no-sandbox" --quiet
```

Target: **90+** on Performance, Accessibility, Best Practices, and SEO for Home and Menu (desktop). Mobile a11y / best-practices / SEO also stay 90+; mobile Performance under Slow-3G sits lower because the hero is a full-bleed photo.
