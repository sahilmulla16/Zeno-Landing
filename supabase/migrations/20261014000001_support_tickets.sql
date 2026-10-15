-- Zeno support tickets: inquiries, bug reports, and data privacy requests.
-- Security model: RLS is ON with NO public policies. Anon and authenticated users cannot
-- read or write tickets directly. All submissions are processed through the `support-ticket`
-- Supabase Edge Function using the service-role key.

create table if not exists public.support_tickets (
  id               uuid primary key default gen_random_uuid(),
  email            text not null,
  email_normalized text generated always as (lower(btrim(email))) stored,
  category         text not null
                     check (category in ('general', 'bug_report', 'smart_autotrack', 'quick_add', 'privacy_data', 'beta_feedback')),
  subject          text not null,
  message          text not null,
  device_info      text,
  app_version      text,
  feature          text,
  status           text not null default 'open'
                     check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at       timestamptz not null default now(),
  ip_hash          text,
  user_agent       text,
  constraint support_ticket_email_len check (char_length(email) between 3 and 254),
  constraint support_ticket_email_fmt check (email_normalized ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  constraint support_ticket_subj_len  check (char_length(subject) between 3 and 200),
  constraint support_ticket_msg_len   check (char_length(message) between 10 and 5000)
);

create index if not exists support_tickets_created_at_idx
  on public.support_tickets (created_at desc);
create index if not exists support_tickets_category_idx
  on public.support_tickets (category);
create index if not exists support_tickets_status_idx
  on public.support_tickets (status);

alter table public.support_tickets enable row level security;
revoke all on public.support_tickets from anon, authenticated;

