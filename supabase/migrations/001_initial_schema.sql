-- TLD Compare — Supabase schema
-- Apply via Supabase SQL Editor or: supabase db push

-- Extensions
create extension if not exists "pgcrypto";

-- TLDs
create table if not exists public.tlds (
  id uuid primary key default gen_random_uuid(),
  extension text not null unique,
  name text not null,
  description text,
  intended_use text,
  restrictions text,
  registry_url text,
  status text not null default 'active' check (status in ('active', 'preview', 'retired')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tlds_extension_idx on public.tlds (extension);
create index if not exists tlds_status_idx on public.tlds (status);

-- Registrars
create table if not exists public.registrars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  official_url text,
  logo_url text,
  api_provider text, -- cloudflare | godaddy | namecheap | mock | none
  status text not null default 'active' check (status in ('active', 'disabled', 'pending')),
  terms_url text,
  support_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Provider capabilities matrix
create table if not exists public.provider_capabilities (
  id uuid primary key default gen_random_uuid(),
  registrar_id uuid not null references public.registrars(id) on delete cascade,
  extension text not null,
  operation text not null, -- search | availability | registration_price | renewal_price | transfer_price | premium | privacy | affiliate
  supported boolean not null default false,
  notes text,
  verified_at timestamptz,
  unique (registrar_id, extension, operation)
);
create index if not exists provider_capabilities_lookup on public.provider_capabilities (extension, operation);

-- Price quotes (live or demo; never invent values)
create table if not exists public.price_quotes (
  id uuid primary key default gen_random_uuid(),
  registrar_id uuid not null references public.registrars(id) on delete cascade,
  domain_name text, -- null = extension-level list price
  extension text not null,
  price_type text not null check (price_type in ('registration', 'renewal', 'transfer', 'privacy', 'premium')),
  amount numeric(12,2),
  currency text not null default 'USD',
  premium_status text default 'standard' check (premium_status in ('standard', 'premium', 'unknown')),
  source_type text not null check (source_type in ('live_api', 'cached', 'demo', 'manual')),
  fetched_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'ok' check (status in ('ok', 'stale', 'unavailable', 'error')),
  unique (registrar_id, extension, price_type, coalesce(domain_name, ''))
);
create index if not exists price_quotes_ext_type on public.price_quotes (extension, price_type);
create index if not exists price_quotes_fetched on public.price_quotes (fetched_at desc);

-- Availability checks
create table if not exists public.availability_checks (
  id uuid primary key default gen_random_uuid(),
  domain_name text not null,
  registrar_id uuid references public.registrars(id) on delete set null,
  availability_status text not null check (availability_status in (
    'available', 'taken', 'premium', 'restricted', 'unsupported', 'unknown', 'error'
  )),
  source_type text not null check (source_type in ('live_api', 'cached', 'demo')),
  reason text,
  checked_at timestamptz not null default now()
);
create index if not exists availability_domain_idx on public.availability_checks (domain_name, checked_at desc);

-- Provider integration health
create table if not exists public.provider_integrations (
  id uuid primary key default gen_random_uuid(),
  registrar_id uuid not null unique references public.registrars(id) on delete cascade,
  integration_status text not null default 'not_configured'
    check (integration_status in ('not_configured', 'ok', 'degraded', 'error', 'disabled')),
  last_success_at timestamptz,
  last_error_at timestamptz,
  last_error_code text,
  last_error_message text
);

-- Affiliate programs
create table if not exists public.affiliate_programs (
  id uuid primary key default gen_random_uuid(),
  registrar_id uuid not null references public.registrars(id) on delete cascade,
  network text,
  approved boolean not null default false,
  status text not null default 'inactive' check (status in ('active', 'inactive', 'pending')),
  terms_url text,
  verified_at timestamptz
);

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  registrar_id uuid not null references public.registrars(id) on delete cascade,
  destination_type text not null default 'register' check (destination_type in ('register', 'transfer', 'homepage')),
  destination_url text not null,
  tracking_template text,
  active boolean not null default true
);

create table if not exists public.affiliate_click_events (
  id uuid primary key default gen_random_uuid(),
  registrar_id uuid references public.registrars(id) on delete set null,
  page_path text,
  campaign text,
  clicked_at timestamptz not null default now(),
  anonymous_session_id text
);
create index if not exists affiliate_clicks_time on public.affiliate_click_events (clicked_at desc);

-- Content
create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz
);

-- Saved comparisons (optional auth later)
create table if not exists public.saved_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  comparison_data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.website_setup_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  progress_data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid,
  action text not null,
  entity_type text,
  entity_id text,
  created_at timestamptz not null default now()
);

-- RLS: public read for catalog data; writes via service role only
alter table public.tlds enable row level security;
alter table public.registrars enable row level security;
alter table public.provider_capabilities enable row level security;
alter table public.price_quotes enable row level security;
alter table public.availability_checks enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.content_pages enable row level security;

create policy "Public read active tlds" on public.tlds for select using (status = 'active');
create policy "Public read active registrars" on public.registrars for select using (status = 'active');
create policy "Public read capabilities" on public.provider_capabilities for select using (true);
create policy "Public read ok prices" on public.price_quotes for select using (status in ('ok', 'stale'));
create policy "Public read availability" on public.availability_checks for select using (true);
create policy "Public read active affiliate links" on public.affiliate_links for select using (active = true);
create policy "Public read published content" on public.content_pages for select using (status = 'published');

-- Service role bypasses RLS by default in Supabase.
