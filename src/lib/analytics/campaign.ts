export interface CampaignData {
  source: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  content_id: string | null
  referrer: string | null
}

const KEY = 'zeno:campaign'

const clean = (v: string | null): string | null => {
  const s = v?.trim().slice(0, 200)
  return s ? s : null
}

export function parseCampaign(search: string, referrer: string): CampaignData {
  const p = new URLSearchParams(search)
  const utm_source = clean(p.get('utm_source'))
  let refHost: string | null = null
  try {
    refHost = referrer ? new URL(referrer).hostname : null
  } catch {
    refHost = null
  }
  return {
    source: utm_source ?? refHost ?? 'direct',
    utm_source,
    utm_medium: clean(p.get('utm_medium')),
    utm_campaign: clean(p.get('utm_campaign')),
    utm_content: clean(p.get('utm_content')),
    // post / reel identifier; falls back to utm_content
    content_id: clean(p.get('content_id') ?? p.get('post') ?? p.get('utm_content')),
    referrer: clean(referrer),
  }
}

/** First-touch attribution, kept for the tab session so it survives in-page navigation. */
export function getCampaign(): CampaignData {
  const fresh = parseCampaign(window.location.search, document.referrer)
  try {
    const stored = sessionStorage.getItem(KEY)
    const hasParams = fresh.utm_source || fresh.utm_medium || fresh.utm_campaign || fresh.utm_content
    if (stored && !hasParams) return JSON.parse(stored) as CampaignData
    sessionStorage.setItem(KEY, JSON.stringify(fresh))
  } catch {
    /* storage unavailable (private mode etc.) — attribution is best effort */
  }
  return fresh
}
