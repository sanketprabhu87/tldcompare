# TLDCompare

**Compare domain extensions, registrars, prices and availability in one place.**

Production-oriented MVP inspired by the functionality of TLD-List, with original branding, UI and architecture.  
**All seed data is DEMO / SAMPLE DATA** and is clearly labelled in the UI and API.

## Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL + Prisma
- **Auth (ready):** NextAuth / Auth.js schema included
- **Deploy:** Vercel-ready

## Features (MVP)

- Homepage with domain search and stats
- Domain search across popular TLDs (availability UNKNOWN until live providers connected)
- TLD directory with filter, sort, pagination
- TLD detail pages with registrar price comparison and 3-year cost
- Registrar directory and detail pages
- Cheapest extensions list
- Promo codes (demo)
- Public API: `/api/v1/tlds`, `/api/v1/pricing`, `/api/v1/search`, `/api/v1/registrars`
- SEO metadata, canonical URLs
- Affiliate-ready CTAs (demo affiliate URLs)
- Transparent methodology and data-source pages

## Quick start

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Set `DATABASE_URL` and `DIRECT_URL` to a PostgreSQL database (Neon, Supabase, local, etc.).

### 3. Database

```bash
npx prisma db push
npm run db:seed
```

### 4. Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Production build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, etc.).
4. Deploy. Run `prisma db push` and seed via a one-off job or Vercel CLI against the production DB.

## Project structure

```
src/app/           # App Router pages & API
src/components/    # UI, search, layout
src/lib/           # db, pricing, seo, utils
src/providers/     # Registrar/availability adapters (extend here)
prisma/            # Schema + seed
```

## Connecting live data

1. Implement adapters under `src/providers/registrars/<name>/`.
2. Store API keys in env (`REGISTRAR_API_KEY_*`).
3. Schedule updates (Vercel Cron) to write into `Pricing` / `PriceHistory`.
4. Never overwrite valid prices with null on source failure.
5. Set `isDemo: false` and `confidence: VERIFIED|AUTOMATED` for live rows.

## API examples

```
GET /api/v1/tlds?page=1&limit=50
GET /api/v1/pricing?tld=com
GET /api/v1/search?q=example
GET /api/v1/registrars
```

## Important

- Prices are **indicative**. Users must confirm at the registrar.
- Demo data is labelled in UI and API responses.
- Affiliate links use placeholder `?aff=DEMO` — replace with real programs and disclose relationships.
- Do not present mock prices as live offers.

## License

Proprietary / your choice. Not affiliated with ICANN or any registry.

---

## Vercel 404 troubleshooting

If you see **“This page doesn’t exist / 404 NOT_FOUND”** (with an id like `bom1::…`):

### 1. Root Directory (most common)

The app lives at the **repository root** (folders `src/`, `prisma/`, `package.json`).

- In Vercel → Project → **Settings → General → Root Directory**: leave **empty** (or `.`).
- If you pushed a parent folder that *contains* `tldcompare/`, set Root Directory to `tldcompare`.

### 2. Confirm the build succeeded

Vercel → **Deployments** → open the latest deployment → **Building** logs.

You should see `Compiled successfully` / `prisma generate` and no red errors.

Required env vars for a healthy deploy:

| Variable | Required? | Notes |
|----------|-----------|--------|
| `DATABASE_URL` | Yes for data | Postgres connection string (Neon/Supabase) |
| `DIRECT_URL` | Recommended | Same as DATABASE_URL if no pooler, or direct connection |
| `NEXTAUTH_URL` | Recommended | Your production URL, e.g. `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Optional for MVP | Any long random string |

Without `DATABASE_URL`, the site can still load, but TLD/registrar lists stay empty (demo seed not applied).

### 3. Framework preset

Settings → **Build & Development Settings**:

- Framework Preset: **Next.js**
- Build Command: `prisma generate && next build` (or leave default; `package.json` already runs generate)
- Output Directory: leave **empty** (Next.js default)
- Install Command: `npm install`

### 4. After first successful deploy

1. Add `DATABASE_URL` (and `DIRECT_URL`) in Vercel → Settings → Environment Variables.
2. Redeploy.
3. From your machine (with the same `DATABASE_URL`):

```bash
npx prisma db push
npm run db:seed
```

Or use Vercel’s Postgres / Neon integration and run seed once against that DB.

### 5. Which URL are you opening?

Valid routes include:

- `/` (home)
- `/tlds`, `/tlds/com`
- `/search?q=example`
- `/registrars`
- `/cheapest-domain-extensions`
- `/promo-codes`

A path like `/index.html` or a misspelled slug will correctly 404.

"# tldcompare" 
