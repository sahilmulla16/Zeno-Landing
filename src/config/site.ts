/**
 * Site-wide configuration. Anything that is not known yet is read from env and left empty,
 * so the UI renders it as "not available" instead of linking to an invented URL.
 */
const env = import.meta.env

function parseSupabaseUrl(): string {
  let raw =
    (env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
    (env.VITE_SUPABASE_PROJECT_ID as string | undefined)?.trim() ||
    (env.VITE_PROJECT_ID as string | undefined)?.trim() ||
    ''

  if (!raw) return ''
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    if (raw.includes('.supabase.co')) {
      raw = `https://${raw}`
    } else if (!raw.includes('.')) {
      // Handles if user entered just the project ID
      raw = `https://${raw}.supabase.co`
    } else {
      raw = `https://${raw}`
    }
  }
  return raw.replace(/\/$/, '')
}

const supabaseUrl = parseSupabaseUrl()
const supabaseAnonKey =
  ((env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (env.VITE_ANON_KEY as string | undefined) ||
    (env.VITE_SUPABASE_PUBLIC_KEY as string | undefined))?.trim() ?? ''

export const site = {
  name: 'Zeno',
  year: new Date().getFullYear(),
  waitlist: {
    /** Supabase Edge Function that performs the secure, server-side insert. */
    endpoint:
      (env.VITE_WAITLIST_ENDPOINT as string | undefined) ||
      (supabaseUrl ? `${supabaseUrl}/functions/v1/waitlist-signup` : ''),
    anonKey: supabaseAnonKey,
  },
  support: {
    /** Supabase Edge Function that performs the secure support ticket insert. */
    endpoint:
      (env.VITE_SUPPORT_ENDPOINT as string | undefined) ||
      (supabaseUrl ? `${supabaseUrl}/functions/v1/support-ticket` : ''),
  },
  research: {
    /** Supabase Edge Function that stores user research responses. */
    endpoint:
      (env.VITE_RESEARCH_ENDPOINT as string | undefined) ||
      (supabaseUrl ? `${supabaseUrl}/functions/v1/user-research` : ''),
  },
  // TODO(config): set these in .env — see .env.example
  contactEmail: (env.VITE_CONTACT_EMAIL as string | undefined) ?? '',
  links: {
    privacy: '/privacy',
    terms: '/terms',
    support: '/support',
    instagram: (env.VITE_INSTAGRAM_URL as string | undefined) ?? '',
    threads:
      ((env.VITE_THREADS_URL as string | undefined) ||
        (env.VITE_X_URL as string | undefined)) ??
      '',
    x: (env.VITE_X_URL as string | undefined) ?? '',
    linkedin: (env.VITE_LINKEDIN_URL as string | undefined) ?? '',
  },
}
