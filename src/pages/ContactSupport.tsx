import { useState, type FormEvent } from 'react'
import { LegalLayout } from '../components/legal/LegalLayout'
import {
  AlertCircle,
  CheckCircle,
  Mail,
  Shield,
  Sparkle,
  Zap,
} from '../components/ui/Icons'
import { legalConfig } from '../config/legal'
import { Link, PageMeta } from '../lib/router'
import {
  submitSupportTicket,
  SupportError,
  type SupportCategory,
} from '../lib/supabase/support'

export function ContactSupport() {
  const { operator } = legalConfig

  // Form State
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState<SupportCategory>('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [deviceInfo, setDeviceInfo] = useState('')
  const [appVersion, setAppVersion] = useState('')
  const [feature, setFeature] = useState('')
  const [website, setWebsite] = useState('') // Honeypot

  // Submission State
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Honeypot check
    if (website.trim() !== '') {
      setSuccess(true)
      return
    }

    setLoading(true)

    try {
      const res = await submitSupportTicket({
        email,
        category,
        subject,
        message,
        deviceInfo: deviceInfo.trim() || undefined,
        appVersion: appVersion.trim() || undefined,
        feature: feature.trim() || undefined,
        website,
      })

      if (res.ok) {
        setSuccess(true)
        if (res.ticketId) setTicketId(res.ticketId)
      }
    } catch (err) {
      if (err instanceof SupportError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('An unexpected error occurred. Please try again or email us directly.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    setTicketId(null)
    setSubject('')
    setMessage('')
    setDeviceInfo('')
    setAppVersion('')
    setFeature('')
    setErrorMessage(null)
  }

  return (
    <LegalLayout
      title="Contact & Support"
      subtitle="Have questions about Zeno, need troubleshooting assistance, or want to submit beta feedback? Our engineering team is here to help."
      badge="Support & Helpdesk"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Support' },
      ]}
    >
      <PageMeta
        title="Contact & Support — Zeno"
        description="Get in touch with the Zeno support team. Submit troubleshooting requests for Smart Auto-Track, bug reports, feature requests, or privacy inquiries."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Left Column: Direct Support Resources & Troubleshooting */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            How Can We Help You?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            Before submitting a ticket, check these common troubleshooting topics:
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <Zap size={16} className="text-amber-300" />
                <span>Smart Auto-Track Setup</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/65">
                Ensure <strong className="text-white">Notification Access</strong> is toggled ON in your Android System Settings (<code className="rounded bg-white/10 px-1 py-0.5">Settings &gt; Apps &gt; Special App Access &gt; Notification Access</code>). Also verify your banking app produces standard push alerts for transactions.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <Sparkle size={16} className="text-violet-soft" />
                <span>Zeno AI Assistant Queries</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/65">
                Zeno AI works entirely on-device and analyzes expenses already logged in your local ledger. If an answer appears unexpected, check that transactions for that time range are recorded.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <Shield size={16} className="text-emerald-400" />
                <span>Privacy &amp; Data Deletion Requests</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/65">
                To unsubscribe from waitlist updates or request permanent deletion of your email from our marketing tables, select &ldquo;Privacy &amp; Data Request&rdquo; in the form or email us at <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">{operator.privacyEmail}</code>.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <Mail size={16} className="text-white/60" />
                <span>Direct Mailbox</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/65">
                Prefer email? Reach us directly at{' '}
                <a href={`mailto:${operator.supportEmail}`} className="font-mono text-amber-200 underline hover:text-white">
                  {operator.supportEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Support Form */}
        <div>
          <div className="rounded-2xl border border-white/10 bg-[#121218]/90 p-6 shadow-2xl md:p-8">
            <h3 className="text-lg font-bold text-white md:text-xl">
              Submit a Support Ticket
            </h3>
            <p className="mt-1 text-xs text-white/60">
              Fill in your details below and our team will get back to you shortly.
            </p>

            {/* Crucial Security Notice */}
            <div className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/[0.05] p-3.5 text-xs leading-relaxed text-amber-200/90">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-300" />
                <span>
                  <strong className="text-amber-200">Security Notice:</strong> Never submit bank account numbers, UPI PINs, internet banking passwords, OTPs, or complete unredacted bank statements.
                </span>
              </div>
            </div>

            {success ? (
              <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle size={26} />
                </div>
                <h4 className="mt-4 text-base font-semibold text-white">
                  Ticket Received Successfully
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Thank you for reaching out. We have logged your support request
                  {ticketId && (
                    <>
                      {' '}with reference ID <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">{ticketId.slice(0, 8)}</code>
                    </>
                  )}
                  . We will reply to <span className="font-medium text-white">{email}</span> as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {/* Honeypot field (hidden from real users) */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="website">Website (leave blank)</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="support-email" className="block text-xs font-medium text-white/80">
                    Email Address <span className="text-violet-soft">*</span>
                  </label>
                  <input
                    type="email"
                    id="support-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-white/35 transition-colors focus:border-violet-soft focus:bg-white/[0.06] focus:outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label htmlFor="support-category" className="block text-xs font-medium text-white/80">
                    Request Category <span className="text-violet-soft">*</span>
                  </label>
                  <select
                    id="support-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportCategory)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#171720] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-violet-soft focus:outline-none"
                  >
                    <option value="general">General Question / Inquiry</option>
                    <option value="bug_report">Bug Report / Technical Issue</option>
                    <option value="smart_autotrack">Smart Auto-Track Troubleshooting</option>
                    <option value="quick_add">Quick Add &amp; Notifications</option>
                    <option value="privacy_data">Privacy &amp; Data Request</option>
                    <option value="beta_feedback">Beta Feedback &amp; Feature Suggestion</option>
                  </select>
                </div>

                {/* Subject Line */}
                <div>
                  <label htmlFor="support-subject" className="block text-xs font-medium text-white/80">
                    Subject Line <span className="text-violet-soft">*</span>
                  </label>
                  <input
                    type="text"
                    id="support-subject"
                    required
                    maxLength={200}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of the issue or question"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-white/35 transition-colors focus:border-violet-soft focus:bg-white/[0.06] focus:outline-none"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="support-message" className="block text-xs font-medium text-white/80">
                    Detailed Message <span className="text-violet-soft">*</span>
                  </label>
                  <textarea
                    id="support-message"
                    required
                    rows={4}
                    maxLength={5000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details, steps to reproduce, or your question..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-white/35 transition-colors focus:border-violet-soft focus:bg-white/[0.06] focus:outline-none"
                  />
                  <span className="mt-1 block text-right text-[11px] text-white/40">
                    {message.length}/5000
                  </span>
                </div>

                {/* Optional Device / Version Details */}
                <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                  <div>
                    <label htmlFor="support-device" className="block text-[11px] font-medium text-white/60">
                      Device / Android OS (Optional)
                    </label>
                    <input
                      type="text"
                      id="support-device"
                      value={deviceInfo}
                      onChange={(e) => setDeviceInfo(e.target.value)}
                      placeholder="e.g. Pixel 8, Android 14"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-violet-soft focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="support-app-version" className="block text-[11px] font-medium text-white/60">
                      Zeno App Version (Optional)
                    </label>
                    <input
                      type="text"
                      id="support-app-version"
                      value={appVersion}
                      onChange={(e) => setAppVersion(e.target.value)}
                      placeholder="e.g. 0.9.2-beta"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-violet-soft focus:outline-none"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-300">
                    {errorMessage}
                  </div>
                )}

                {/* Privacy Assurance Link */}
                <p className="pt-2 text-[11px] leading-relaxed text-white/45">
                  By submitting this form, you acknowledge that your inquiry will be processed in accordance with our{' '}
                  <Link href="/privacy" className="text-white/70 underline hover:text-white">
                    Privacy Policy
                  </Link>
                  . Information is used strictly to resolve your support ticket.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      <span>Sending Ticket...</span>
                    </>
                  ) : (
                    <span>Submit Support Ticket</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </LegalLayout>
  )
}
