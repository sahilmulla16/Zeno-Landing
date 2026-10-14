-- Zeno waitlist: signups + abuse protection.
-- Security model: RLS is ON and NO policies are created, so anon/authenticated users can neither
-- read nor write these tables. All writes go through the `waitlist-signup` Edge Function, which
-- uses the service-role key server-side only.

create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  email_normalized   text generated always as (lower(btrim(email))) stored,
  created_at         timestamptz not null default now(),
  status             text not null default 'pending'
                       check (status in ('pending', 'confirmed', 'unsubscribed')),
  source             text,
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text,
  content_id         text,
  referrer           text,
  consent_marketing  boolean not null default false,
  consent_at         timestamptz,
  research_responses jsonb not null default '{}'::jsonb,
  ip_hash            text,
  user_agent         text,
  constraint waitlist_email_length check (char_length(email) between 3 and 254),
  constraint waitlist_email_format  check (email_normalized ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  constraint waitlist_consent_ts    check (consent_marketing = false or consent_at is not null),
  constraint waitlist_research_size check (pg_column_size(research_responses) <= 4096)
);

-- Duplicate prevention: one row per normalized address.
create unique index if not exists waitlist_signups_email_normalized_key
  on public.waitlist_signups (email_normalized);
create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);
create index if not exists waitlist_signups_campaign_idx
  on public.waitlist_signups (utm_campaign, utm_source);

alter table public.waitlist_signups enable row level security;
revoke all on public.waitlist_signups from anon, authenticated;

-- Fixed-window rate limiter keyed by salted IP hash.
create table if not exists public.waitlist_rate_limits (
  ip_hash      text        not null,
  window_start timestamptz not null,
  hits         integer     not null default 1,
  primary key (ip_hash, window_start)
);
alter table public.waitlist_rate_limits enable row level security;
revoke all on public.waitlist_rate_limits from anon, authenticated;

create or replace function public.waitlist_check_rate_limit(
  p_ip_hash        text,
  p_max            integer default 5,
  p_window_seconds integer default 600
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bucket timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_hits   integer;
begin
  insert into public.waitlist_rate_limits as r (ip_hash, window_start, hits)
  values (p_ip_hash, v_bucket, 1)
  on conflict (ip_hash, window_start) do update set hits = r.hits + 1
  returning r.hits into v_hits;

  -- opportunistic cleanup keeps the table tiny
  if random() < 0.02 then
    delete from public.waitlist_rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_hits <= p_max;
end;
$$;

revoke all on function public.waitlist_check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.waitlist_check_rate_limit(text, integer, integer) to service_role;
