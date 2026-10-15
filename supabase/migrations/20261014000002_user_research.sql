-- Zeno post-signup user research & product feedback schema.
-- Security model: RLS is enabled with all public access revoked.
-- Submissions are processed exclusively via the `user-research` Supabase Edge Function
-- using the service-role key.

create table if not exists public.user_research (
  id                          uuid primary key default gen_random_uuid(),
  signup_id                   uuid references public.waitlist_signups(id) on delete set null,
  email                       text,
  primary_pain_point          text,
  primary_pain_other          text,
  current_tracking_method     text,
  desired_outcome             text,
  feature_suggestion          text,
  feature_contact_consent     boolean not null default false,
  feature_contact_consent_at  timestamptz,
  research_completed_at       timestamptz default now(),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  ip_hash                     text,
  constraint research_pain_other_len check (primary_pain_other is null or char_length(primary_pain_other) <= 200),
  constraint research_feature_len    check (feature_suggestion is null or char_length(feature_suggestion) <= 500)
);

-- Unique index so repeated submissions from the same signup update the existing record
create unique index if not exists user_research_signup_id_key
  on public.user_research(signup_id)
  where signup_id is not null;

create index if not exists user_research_email_idx on public.user_research(email);
create index if not exists user_research_created_at_idx on public.user_research(created_at desc);

alter table public.user_research enable row level security;
revoke all on public.user_research from anon, authenticated;

