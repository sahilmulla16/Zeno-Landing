import { type ReactNode } from 'react'
import { legalConfig } from '../../config/legal'
import { Link, useRouter } from '../../lib/router'
import { Logo } from '../brand/Logo'
import { Footer } from '../footer/Footer'
import { ArrowLeft, FileText, HelpCircle, Shield } from '../ui/Icons'

interface Props {
  title: string
  subtitle?: string
  lastUpdated?: string
  badge?: string
  breadcrumbs: { label: string; href?: string }[]
  children: ReactNode
}

export function LegalLayout({
  title,
  subtitle,
  lastUpdated = legalConfig.lastUpdated,
  badge = 'Legal & Privacy',
  breadcrumbs,
  children,
}: Props) {
  const { path } = useRouter()

  const tabs = [
    { label: 'Privacy Policy', href: '/privacy', icon: Shield },
    { label: 'Terms of Use', href: '/terms', icon: FileText },
    { label: 'Contact & Support', href: '/support', icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-ink,#0b0b0f)] text-white antialiased selection:bg-violet-soft/40">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0b0b0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-6">
            <Logo href="/" />
            <div className="hidden h-5 w-px bg-white/15 sm:block" />
            <Link
              href="/"
              className="group hidden items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white sm:flex"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:hidden"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </Link>
            <Link
              href="/#waitlist"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Tabs */}
      <div className="border-b border-white/[0.06] bg-[#121218]/40">
        <div className="mx-auto flex max-w-5xl overflow-x-auto px-5 py-2.5 scrollbar-none md:px-8">
          <nav aria-label="Legal & Support Pages" className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = path === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? 'border border-violet-soft/40 bg-violet-soft/15 text-white shadow-[0_0_16px_-4px_rgba(139,92,246,0.35)]'
                      : 'border border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-amber-200' : 'text-white/40'} />
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/50">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.label} className="flex items-center gap-2">
              {idx > 0 && <span className="text-white/25">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-white/80">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Header Block */}
        <header className="mb-12 border-b border-white/[0.08] pb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-medium text-white/70">
            <span className="size-1.5 rounded-full bg-violet-soft" />
            <span>{badge}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
              {subtitle}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/45">
            <span>Last Updated: {lastUpdated}</span>
            <span className="text-white/20">•</span>
            <span>Effective Date: {legalConfig.effectiveDate}</span>
          </div>
        </header>

        {/* Prose / Document Body */}
        <div className="prose prose-invert max-w-none text-white/80">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}

