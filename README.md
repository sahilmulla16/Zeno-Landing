# Zeno landing page

React + TypeScript + Vite + Tailwind v4 + GSAP/ScrollTrigger. Waitlist on Supabase.

```bash
npm i
cp .env.example .env.local   # fill in Supabase URL + anon key
npm run dev                  # dev server
npm run build && npm test    # typecheck, build, unit tests
```

## Waitlist backend
1. `supabase db push` (applies `supabase/migrations/*_waitlist.sql`: table, unique index, RLS with no public policies, rate-limit function).
2. `supabase secrets set WAITLIST_IP_SALT=<random> ALLOWED_ORIGINS=https://your.site,http://localhost:5173`
3. `supabase functions deploy waitlist-signup`

The browser only calls the Edge Function; the service-role key never reaches the client.
Unset legal/social/contact links in `.env` render as disabled labels, not invented URLs.
