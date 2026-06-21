-- AgenticZillow — Supabase/Postgres schema (pgvector).
-- Apply ONLY to the project dedicated to AgenticZillow. Never touch other projects.
-- The app runs DB-agnostic today (in-memory JSON); wire SupabaseRepository behind
-- the Repository interface (src/lib/data/repository.ts) once this is applied.

create extension if not exists vector;
create extension if not exists pg_trgm;

-- ── Listings ────────────────────────────────────────────────────
create table if not exists listings (
  id            text primary key,
  slug          text unique not null,
  status        text not null,
  transaction   text not null,                 -- buy | rent | sold | off-market
  price         integer not null,
  beds          numeric not null,
  baths         numeric not null,
  sqft          integer not null,
  lot_sqft      integer,
  year_built    integer,
  home_type     text not null,
  line1         text not null,
  city          text not null,
  state         text not null,
  zip           text not null,
  lat           double precision not null,
  lng           double precision not null,
  neighborhood  text,
  metro_id      text not null,
  photos        jsonb not null default '[]',
  description   text,
  features      jsonb not null default '[]',
  hoa           integer,
  days_on_market integer,
  listed_at     timestamptz,
  price_cut     jsonb,
  zestimate     integer,
  rent_zestimate integer,
  price_per_sqft integer,
  attribution   text,
  school_rating integer,
  walk_score    integer,
  est_monthly_rent integer,
  cap_rate      numeric,
  search_text   text,
  embedding     vector(256)                     -- 256-d local hashed embeddings (parity with the in-memory path; swap to 768 for Gemini)
);

create index if not exists listings_metro_idx on listings (metro_id);
create index if not exists listings_txn_idx on listings (transaction);
create index if not exists listings_price_idx on listings (price);
create index if not exists listings_embedding_idx on listings using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ── Agents & lenders ────────────────────────────────────────────
create table if not exists agents_lenders (
  id          text primary key,
  name        text not null,
  kind        text not null,                    -- agent | lender
  title       text,
  brokerage   text,
  metro_id    text,
  photo       text,
  rating      numeric,
  reviews     integer,
  sales       integer,
  price_range text,
  specialties jsonb default '[]',
  phone       text,
  bio         text
);

-- ── Users (guest-first + demo super-user) ───────────────────────
create table if not exists users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique,
  name       text not null default 'Guest',
  is_guest   boolean not null default true,
  is_demo    boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists saved_homes (
  user_id    uuid references users(id) on delete cascade,
  listing_id text references listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists saved_searches (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  label      text,
  filters    jsonb not null,
  alerts     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Conversations & the Live Activity Timeline ──────────────────
create table if not exists conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role            text not null,                -- user | assistant | system
  content         text not null,
  created_at      timestamptz not null default now()
);

create table if not exists agent_runs (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  mode            text not null,                -- chat | autonomous
  cost_usd        numeric not null default 0,
  created_at      timestamptz not null default now()
);

create table if not exists agent_steps (
  id        uuid primary key default gen_random_uuid(),
  run_id    uuid references agent_runs(id) on delete cascade,
  agent     text not null,                      -- orchestrator | search | market | finance | concierge | neighborhood
  label     text not null,
  status    text not null,                      -- pending | running | ok | error
  tool      text,
  provider  text,
  model     text,
  cost_usd  numeric,
  duration_ms integer,
  ord       integer not null default 0
);

-- ── Hybrid search: structured filters + vector similarity ───────
create or replace function match_listings(
  query_embedding vector(256),
  match_count int default 24,
  filter_transaction text default 'buy',
  max_price int default null,
  min_beds numeric default null
)
returns setof listings
language sql stable
as $$
  select *
  from listings
  where transaction = filter_transaction
    and (max_price is null or price <= max_price)
    and (min_beds is null or beds >= min_beds)
  order by embedding <=> query_embedding
  limit match_count;
$$;
