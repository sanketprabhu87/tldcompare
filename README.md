# TLD Compare

Independent **domain extension & registrar comparison** platform.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · **Supabase PostgreSQL** (JS client + RLS)
- **Deploy:** GitHub + Vercel
- **Data:** Provider-adapter architecture (Cloudflare, GoDaddy, Namecheap skeletons + mock demo provider)

This is a comparison and referral site. It does **not** register domains or process third-party payments.

## Feature status

| Feature | Status |
|---------|--------|
| Homepage + search UX | Operational |
| TLD directory & detail pages | Operational |
| Side-by-side TLD compare | Operational |
| Domain search API | Operational (demo provider by default) |
| 1/3/5-year ownership calculator | Operational |
| Website setup checklist | Operational |
| Supabase schema + RLS policies | Operational (apply SQL migration) |
| Seed catalog script | Operational |
| Mock/demo provider | Operational — labelled DEMO |
| Cloudflare / GoDaddy / Namecheap live APIs | **Adapters ready** — activate after credentials & access approval |
| Affiliate click tracking DB | Schema ready — wire routes when programs approved |
| Admin dashboard | Schema/audit table ready — UI phase 5 |
| Playwright e2e | Scaffold — expand journeys as needed |

## Quick start

```bash
npm install
cp .env.example .env
# Optional: add Supabase keys. App runs in DEMO_MODE without them.
npm run dev
```

Open http://localhost:3000

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste and run `supabase/migrations/001_initial_schema.sql`.
3. Project Settings → API → copy URL, anon key, service role key into `.env`.
4. Seed catalog:

```bash
npm run db:seed
```

### Live providers

Set credentials in `.env` and `DEMO_MODE=false` only after access is verified:

| Provider | Variables | Docs |
|----------|-----------|------|
| Cloudflare | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | https://developers.cloudflare.com/registrar/registrar-api/ |
| GoDaddy | `GODADDY_API_KEY`, `GODADDY_API_SECRET` | https://developer.godaddy.com/ |
| Namecheap | `NAMECHEAP_API_USER`, `NAMECHEAP_API_KEY`, `NAMECHEAP_USERNAME`, `NAMECHEAP_CLIENT_IP` | https://www.namecheap.com/support/api/intro/ |

Adapters live under `src/lib/providers/`. They return explicit “not configured / not wired” responses rather than fake prices.

## Vercel deploy

1. Push repo to GitHub (root = folder containing `package.json`).
2. Import in Vercel → Framework **Next.js**.
3. Env: `NEXT_PUBLIC_APP_URL`, Supabase keys, `DEMO_MODE`, optional provider keys, `CRON_SECRET`.
4. Deploy. Apply migration + seed against the same Supabase project.

## API

```
GET /api/v1/search?q=mybrand
GET /api/v1/tlds
GET /api/v1/registrars
GET /api/v1/availability?domain=example.com
```

## Tests

```bash
npm test
npm run typecheck
npm run build
```

## Architecture

```
src/lib/providers/     # DomainProvider interface + mock + CF/GD/NC
src/lib/supabase/      # server + browser clients
src/lib/pricing/       # ownership cost (no invented numbers)
src/lib/domain/        # parse & validate input
supabase/migrations/   # SQL + RLS
scripts/seed.ts        # catalog metadata only
```

## Production launch checklist

1. [ ] Supabase migration applied  
2. [ ] Seed run  
3. [ ] Vercel env configured  
4. [ ] `DEMO_MODE` understood (true until live APIs verified)  
5. [ ] Provider accounts approved / IP whitelist (Namecheap)  
6. [ ] Affiliate programs approved before enabling links  
7. [ ] Custom domain + monitoring  
8. [ ] Legal pages reviewed (privacy, terms, affiliate disclosure)

## Principles

- Never invent availability or prices.  
- Label demo/cached/live clearly.  
- Registration year ≠ renewal years.  
- Affiliate rankings must not override objective price data.  
- Secrets never in `NEXT_PUBLIC_*` or client bundles.
