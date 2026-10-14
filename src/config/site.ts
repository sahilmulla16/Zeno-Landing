/**
 * Site-wide configuration. Anything that is not known yet is read from env and left empty,
 * so the UI renders it as "not available" instead of linking to an invented URL.
 */
const env = import.meta.env

const supabaseUrl = (env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export const site = {
  name: 'Zeno',
  year: new Date().getFullYear(),
  waitlist: {
    /** Supabase Edge Function that performs the secure, server-side insert. */
    endpoint:
      (env.VITE_WAITLIST_ENDPOINT as string | undefined) ||
      (supabaseUrl ? `${supabaseUrl}/functions/v1/waitlist-signup` : ''),
    anonKey: (env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '',
  },
  // TODO(config): set these in .env — see .env.example
  contactEmail: (env.VITE_CONTACT_EMAIL as string | undefined) ?? '',
  links: {
    privacy: (env.VITE_PRIVACY_URL as string | undefined) ?? '',
    terms: (env.VITE_TERMS_URL as string | undefined) ?? '',
    instagram: (env.VITE_INSTAGRAM_URL as string | undefined) ?? '',
    x: (env.VITE_X_URL as string | undefined) ?? '',
    linkedin: (env.VITE_LINKEDIN_URL as string | undefined) ?? '',
  },
}
