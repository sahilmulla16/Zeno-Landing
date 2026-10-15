import type { ReactNode } from 'react'
import { footer } from '../../config/content'
import { site } from '../../config/site'
import { Link, useRouter } from '../../lib/router'
import { Logo } from '../brand/Logo'
import { Instagram, Mail, Threads } from '../ui/Icons'

/** Renders a real link when configured; otherwise a clearly non-interactive label (no invented URLs). */
function MaybeLink({ href, children, external, label }: { href?: string; children: ReactNode; external?: boolean; label?: string }) {
  const cls = 'text-[15px] text-white/75 transition-colors hover:text-white'
  if (!href) {
    return (
      <span aria-disabled="true" title="Coming soon" aria-label={label} className="text-[15px] text-white/35">
        {children}
      </span>
    )
  }
  return (
    <a href={href} aria-label={label} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  )
}

export function Footer() {
  const { path } = useRouter()
  const { links, contactEmail } = site
  const social = [
    { label: 'Instagram', href: links.instagram, icon: <Instagram size={20} /> },
    { label: 'Threads', href: links.threads, icon: <Threads size={18} /> },
    { label: 'Email', href: contactEmail ? `mailto:${contactEmail}` : '', icon: <Mail size={20} /> },
  ]

  return (
    <footer className="relative border-t border-white/[0.06] px-5 pb-12 pt-20 md:px-10">
      <div className="mx-auto grid max-w-[1560px] gap-14 lg:grid-cols-[1.1fr_1.2fr] lg:px-[7%]">
        <div>
          <Logo className="mb-6" />
          <div className="flex items-center gap-5">
            {social.map((s) => (
              <MaybeLink key={s.label} href={s.href} external={!s.href.startsWith('mailto:')} label={s.label}>
                <span className="grid size-6 place-items-center">{s.icon}</span>
              </MaybeLink>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h4 className="mb-4 text-[16px] font-medium">Company</h4>
            <ul className="space-y-2.5">
              {footer.company.map((l) => {
                const targetHref = path === '/' ? l.href : `/${l.href}`
                return (
                  <li key={l.label}>
                    <Link href={targetHref} className="text-[15px] text-white/75 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[16px] font-medium">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-[15px] text-white/75 transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[15px] text-white/75 transition-colors hover:text-white">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-[15px] text-white/75 transition-colors hover:text-white">
                  Contact &amp; Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[16px] font-medium">Social</h4>
            <ul className="space-y-2.5">
              <li>
                <MaybeLink href={links.instagram} external>
                  Instagram
                </MaybeLink>
              </li>
              <li>
                <MaybeLink href={links.threads} external>
                  Threads
                </MaybeLink>
              </li>
              <li>
                <MaybeLink href={links.linkedin} external>
                  LinkedIn
                </MaybeLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <p className="mx-auto mt-16 max-w-[1560px] text-[13px] text-white/40 lg:px-[7%]">
        © {site.year} {site.name}. All rights reserved.
      </p>
    </footer>
  )
}
