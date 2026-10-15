import { LegalLayout } from '../components/legal/LegalLayout'
import { AlertCircle, CheckCircle, Shield } from '../components/ui/Icons'
import { legalConfig } from '../config/legal'
import { Link, PageMeta } from '../lib/router'

export function PrivacyPolicy() {
  const { operator, disclaimers, minimumAge } = legalConfig

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How Zeno handles information across our marketing website and local-first personal finance application."
      badge="Privacy & Data Governance"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Legal' },
        { label: 'Privacy Policy' },
      ]}
    >
      <PageMeta
        title="Privacy Policy — Zeno"
        description="Learn how Zeno protects your privacy. Transparent breakdown of our local-first Android architecture, on-device AI, and marketing website waitlist data handling."
      />

      {/* Summary Highlights */}
      <div className="mb-12 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-3 sm:p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield size={18} className="text-violet-soft" />
            <span>Local-First Core</span>
          </div>
          <p className="text-xs leading-relaxed text-white/60">
            Financial transactions, budgets, and accounts remain stored locally on your Android device. We do not sync your personal financial ledger to cloud servers.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CheckCircle size={18} className="text-emerald-400" />
            <span>On-Device AI Assistant</span>
          </div>
          <p className="text-xs leading-relaxed text-white/60">
            Zeno AI queries are processed locally against your device records. Your financial queries are not routed to third-party cloud LLM providers (e.g. Gemini, OpenAI).
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <AlertCircle size={18} className="text-amber-300" />
            <span>Opt-In Auto-Track</span>
          </div>
          <p className="text-xs leading-relaxed text-white/60">
            Smart Auto-Track requires your explicit Android Notification Access permission. Only supported transaction alerts are parsed; OTPs and personal messages are discarded.
          </p>
        </div>
      </div>

      {/* Section 1: Scope & Architectural Distinction */}
      <section className="mb-10">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          1. Architectural Scope: Marketing Website vs. Mobile Application
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          To provide complete transparency, this Privacy Policy clearly distinguishes between two fundamentally separate systems operated under the Zeno product name:
        </p>
        <ul className="mt-4 space-y-3 pl-5 text-sm leading-relaxed text-white/70 list-disc">
          <li>
            <strong className="text-white">The Marketing Website ({'zeno.app'}):</strong> Our public website is used exclusively to showcase product capabilities, publish informational resources, and allow interested visitors to join our early-access waitlist or contact support.
          </li>
          <li>
            <strong className="text-white">The Zeno Mobile Application (Android):</strong> Our downloadable personal expense tracker is engineered from the ground up on a <span className="text-white font-medium">local-first architecture</span>. Your financial transactions, budgets, category records, and AI inquiries are processed and stored directly on your personal device.
          </li>
        </ul>
      </section>

      {/* Section 2: Website Waitlist Data */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          2. Information Collected by the Marketing Website
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          When you interact with our marketing landing page or join our waitlist, we collect only the minimal information necessary to communicate launch updates and protect our service against abuse:
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white">A. Email Address &amp; Consent Record</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/65">
              When you submit your email in our waitlist form, we record your email address, an affirmative marketing consent flag (<code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">consent_marketing: true</code>), and the exact ISO-8601 timestamp of your submission. We use this strictly to notify you when Zeno beta slots or public releases become available.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white">B. Campaign Attribution &amp; Referrer Parameters</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/65">
              If you arrived via an external marketing campaign or partner link, our website reads standard URL query parameters (specifically <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">utm_source</code>, <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">utm_medium</code>, <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">utm_campaign</code>, <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">utm_content</code>, and <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">referrer</code>). These values help us understand which communication channels effectively reach prospective users.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white">C. Optional Research Feedback</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/65">
              Visitors may optionally choose a primary financial goal (e.g. &ldquo;Expense tracking&rdquo;, &ldquo;Budgets &amp; limits&rdquo;, or &ldquo;Zeno AI&rdquo;) from our waitlist dropdown. This non-identifying categorical response helps our engineering team prioritize upcoming features.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white">D. Abuse Prevention &amp; Rate-Limiting Signals</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/65">
              To defend our edge functions against bot denial-of-service and automated spam, our backend computes a salted SHA-256 hash of the client IP address (<code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">sha256(salt + ip)</code>) alongside the browser User-Agent header. We do not store raw, unhashed IP addresses in waitlist tables. Rate limit buckets automatically expire after 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Financial Information in Zeno Mobile Application */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          3. Financial Information in the Zeno Android Application
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Our core privacy thesis is that personal financial transactions belong to the person who made them. In accordance with this principle:
        </p>

        <ul className="mt-4 space-y-3 pl-5 text-sm leading-relaxed text-white/70 list-disc">
          <li>
            <strong className="text-white">Local-First Ledger:</strong> All transaction records (amounts, merchant names, categories, tags, notes, dates, and spending limit thresholds) are stored locally in an on-device database on your Android hardware.
          </li>
          <li>
            <strong className="text-white">Zero Remote Transmission of Financial Data:</strong> Zeno does not upload your transactions, account balances, or personal financial history to our servers, Supabase, or any cloud database.
          </li>
          <li>
            <strong className="text-white">Complete Offline Functionality:</strong> You can log expenses, inspect budget burn rates, review spending summaries, and query Zeno AI without an active Wi-Fi or cellular data connection.
          </li>
          <li>
            <strong className="text-white">Data Export and Portability:</strong> You maintain full ownership of your records. You may export your transaction history at any time in standard formats (such as CSV or JSON) directly to your device storage.
          </li>
        </ul>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/60">
          <strong className="text-white">Backup Notice:</strong> If you utilize third-party Android system backup features (such as Google One or Android Auto-Backup) or manually copy exported files to cloud storage, those backups are governed by your agreement with those respective providers.
        </div>
      </section>

      {/* Section 4: Zeno AI Assistant */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          4. Zeno AI Assistant &amp; Local Inference
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Zeno includes an AI assistant designed to help you analyze spending patterns in plain language (e.g., &ldquo;How much did I spend on dining out this week?&rdquo;):
        </p>

        <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/70">
          <p>
            • <strong className="text-white">Local Processing Model:</strong> The intended architecture of Zeno AI executes model inference locally on your device hardware, evaluating queries directly against your local SQLite database without sending your financial records to external cloud LLM providers (such as Google Gemini, OpenAI, or Anthropic).
          </p>
          <p>
            • <strong className="text-white">No Model Training on Personal Records:</strong> Because your transaction records remain strictly on-device, they are never used to train public machine learning models or commercial foundation models.
          </p>
          <p>
            • <strong className="text-white">Informational Nature &amp; Disclaimers:</strong> {disclaimers.aiAdvice} {disclaimers.financialInstitution}
          </p>
        </div>
      </section>

      {/* Section 5: Smart Auto-Track & Android Permissions */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          5. Smart Auto-Track &amp; Android Notification Access
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Smart Auto-Track is an optional convenience feature that simplifies expense logging by detecting transaction confirmations:
        </p>

        <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/70">
          <p>
            • <strong className="text-white">Android Notification Access:</strong> The feature relies on Android&rsquo;s <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">NotificationListenerService</code>. This permission is disabled by default and requires your explicit authorization in your device&rsquo;s Android System Settings.
          </p>
          <p>
            • <strong className="text-white">Selective Local Parsing:</strong> When a push alert is posted by a supported banking, card, or payment application, Zeno&rsquo;s local parser extracts only the relevant transaction amount and merchant/payee name.
          </p>
          <p>
            • <strong className="text-white">Immediate Discard of Sensitive Data:</strong> Non-financial notifications, one-time passwords (OTPs), personal text messages, promotional alerts, and alerts from unsupported apps are immediately ignored and never recorded or transmitted.
          </p>
          <p>
            • <strong className="text-white">SMS History Limitation:</strong> Zeno does not inspect or sweep your historical SMS inbox. Detection occurs exclusively in real-time as notifications appear on your device.
          </p>
          <p>
            • <strong className="text-white">User Control &amp; Revocation:</strong> You can disable Smart Auto-Track at any time from Zeno&rsquo;s settings or revoke Notification Access directly in Android&rsquo;s system permissions.
          </p>
        </div>
      </section>

      {/* Section 6: Quick Add & System Notifications */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          6. Quick Add &amp; Local Device Notifications
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Zeno provides quick-entry shortcuts and optional local alert mechanisms:
        </p>
        <ul className="mt-4 space-y-2 pl-5 text-sm leading-relaxed text-white/70 list-disc">
          <li>
            <strong className="text-white">Quick Add Shortcuts:</strong> Enables rapid manual transaction logging from your Android home screen or lock screen widget without launching the full application interface.
          </li>
          <li>
            <strong className="text-white">Local Threshold Notifications:</strong> Zeno schedules local on-device notifications to alert you when your monthly category burn rate approaches a defined limit. These notifications originate locally from your phone and are not generated by a remote push server.
          </li>
          <li>
            <strong className="text-white">System Delivery Dependencies:</strong> Notification timing and background execution are subject to Android OEM battery saver policies and user notification settings.
          </li>
        </ul>
      </section>

      {/* Section 7: Third-Party Service Providers */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          7. Third-Party Service Providers
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          We work with a minimal set of infrastructure providers strictly to operate our public marketing website and support channels:
        </p>

        <div className="mt-6 divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <div className="p-4 text-xs leading-relaxed text-white/70">
            <strong className="text-sm font-semibold text-white">Supabase Inc.:</strong> Used solely as the backend database for our marketing website waitlist and support ticket reception. Protected by PostgreSQL Row Level Security (RLS) with all public read access revoked. <span className="text-amber-200">Supabase has zero access to Zeno mobile application financial transactions.</span>
          </div>
          <div className="p-4 text-xs leading-relaxed text-white/70">
            <strong className="text-sm font-semibold text-white">Hosting &amp; Edge Infrastructure:</strong> Our static marketing assets, CSS, and edge functions are delivered via modern edge networks (such as Vercel / Cloudflare). These providers process standard HTTP request logs (IP address, requested path) strictly for network security and DDoS mitigation.
          </div>
          <div className="p-4 text-xs leading-relaxed text-white/70">
            <strong className="text-sm font-semibold text-white">No Advertising Brokers or Data Brokers:</strong> We do not sell, rent, or trade your personal email or support information to advertising networks, data brokers, or marketing intermediaries.
          </div>
        </div>
      </section>

      {/* Section 8: Security, Retention & Your Rights */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          8. Security, Retention &amp; User Privacy Rights
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          We maintain strict organizational and technical safeguards:
        </p>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/70">
          <div>
            <h3 className="font-semibold text-white">Data Retention Policy:</h3>
            <p className="mt-1 text-xs text-white/65">
              Waitlist email records and attribution data are retained until the general public launch of Zeno, or until you exercise your right to unsubscribe or request deletion. Support tickets are retained for up to 180 days to resolve technical and customer service requests, after which they are purged.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white">Your Individual Rights:</h3>
            <p className="mt-1 text-xs text-white/65">
              Regardless of your location, you have the right to request access to the personal data we hold about you, request correction of inaccurate data, or request permanent deletion of your waitlist record. You may exercise these rights at any time by contacting our privacy team at <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">{operator.privacyEmail}</code> or using our <Link href="/support" className="text-violet-soft underline hover:text-white">Contact &amp; Support form</Link>.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white">Children&rsquo;s Privacy:</h3>
            <p className="mt-1 text-xs text-white/65">
              Zeno is not directed to individuals under the age of {minimumAge}. We do not knowingly collect personal information from minors. If you believe a minor has submitted personal information through our waitlist, please contact us immediately for prompt deletion.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: Legal Operator & Verification Notice */}
      <section className="mb-12 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          9. Legal Operator &amp; Contact Details
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          For inquiries regarding this Privacy Policy or data protection matters, please direct correspondence to:
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-white/75">
          <p className="font-semibold text-white">{operator.name}</p>
          <p className="mt-1 text-xs text-white/60">Governing Jurisdiction: {operator.jurisdiction}</p>
          <p className="text-xs text-white/60">Address: {operator.address}</p>
          <p className="mt-3 text-xs">
            Privacy &amp; Data Rights Mailbox:{' '}
            <span className="font-mono text-amber-200">{operator.privacyEmail}</span>
          </p>
          <p className="text-xs">
            Support Portal:{' '}
            <Link href="/support" className="text-violet-soft underline hover:text-white">
              zeno.app/support
            </Link>
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-4 text-xs leading-relaxed text-amber-200/90">
          <strong className="block font-semibold text-amber-200">Policy Update Notice:</strong> We may revise this Privacy Policy periodically to reflect enhancements to our Android application or changes in regulatory standards. The &ldquo;Last Updated&rdquo; date at the top of this document indicates the effective date of the latest revisions.
        </div>
      </section>
    </LegalLayout>
  )
}
