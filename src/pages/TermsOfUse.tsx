import { LegalLayout } from '../components/legal/LegalLayout'
import { AlertCircle } from '../components/ui/Icons'
import { legalConfig } from '../config/legal'
import { Link, PageMeta } from '../lib/router'

export function TermsOfUse() {
  const { operator, disclaimers, minimumAge } = legalConfig

  return (
    <LegalLayout
      title="Terms of Use"
      subtitle="Terms and conditions governing your access to the Zeno marketing website and Android application."
      badge="Legal Agreement"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Legal' },
        { label: 'Terms of Use' },
      ]}
    >
      <PageMeta
        title="Terms of Use — Zeno"
        description="Review the Zeno Terms of Use. Transparent terms governing our marketing waitlist, local-first Android expense tracker, on-device AI assistant, and disclaimers."
      />

      {/* Crucial Disclaimers Callout */}
      <div className="mb-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={22} className="mt-0.5 shrink-0 text-amber-300" />
          <div className="text-xs leading-relaxed text-white/75 space-y-2">
            <p>
              <strong className="text-white text-sm block">Core Financial Software Disclaimers:</strong>
              {disclaimers.financialInstitution}
            </p>
            <p>
              {disclaimers.aiAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Acceptance */}
      <section className="mb-10">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          1. Acceptance of Terms
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          These Terms of Use (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and {operator.name} (&ldquo;Zeno&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing our website at <Link href="/" className="text-violet-soft underline hover:text-white">zeno.app</Link>, registering for our early-access waitlist, or downloading, installing, or using the Zeno Android application (the &ldquo;App&rdquo;), you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree to these Terms, you must not access the website or use the application.
        </p>
      </section>

      {/* Section 2: Eligibility & Capacity */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          2. Eligibility &amp; User Capacity
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          You must be at least {minimumAge} years of age, or the legal age of majority in your jurisdiction, to utilize the Zeno application or submit your email to our waitlist. By using Zeno, you represent and warrant that you possess the full legal capacity to enter into these Terms and comply with all applicable local, national, and international financial regulations.
        </p>
      </section>

      {/* Section 3: Description of Services & Availability */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          3. Description of Software &amp; Non-Banking Status
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Zeno is a self-directed personal expense-tracking and budgeting productivity utility. It is designed to assist individuals in monitoring personal expenditures, organizing transaction categories, calculating budget burn rates, and querying financial trends via on-device machine learning.
        </p>
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs leading-relaxed text-white/70">
          <strong className="text-white block mb-1">Explicit Non-Fiduciary Status:</strong>
          Zeno does not hold, transmit, custody, deposit, or invest user funds. Zeno does not provide banking services, credit facilities, brokerage accounts, tax preparation, or certified investment advice. You remain solely responsible for your financial decisions, tax obligations, and monetary allocations.
        </div>
      </section>

      {/* Section 4: Waitlist & Beta Access */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          4. Early Access Waitlist &amp; Beta Testing
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
          <p>
            • <strong className="text-white">No Guaranteed Enrollment:</strong> Joining the Zeno website waitlist provides you with notifications regarding launch milestones and private beta slots. Registration on the waitlist does not constitute a contractual guarantee of immediate access, nor does it guarantee specific feature sets upon final release.
          </p>
          <p>
            • <strong className="text-white">Beta &amp; Experimental Features:</strong> Pre-release beta versions of the application may contain bugs, incomplete modules, or interface changes. You acknowledge that your participation in any beta testing program is voluntary, and features are provided &ldquo;as is&rdquo; without warranty of uninterrupted performance.
          </p>
          <p>
            • <strong className="text-white">No Hidden Paid Subscriptions:</strong> Zeno does not charge you or collect payment credentials to join the waitlist. If premium tiers or paid licenses are introduced in the future, clear pricing and cancellation terms will be published prior to enrollment.
          </p>
        </div>
      </section>

      {/* Section 5: Device Security & Local Data Ownership */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          5. Local Data Storage &amp; Device Responsibility
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Because Zeno operates on a <span className="text-white font-medium">local-first architecture</span>:
        </p>
        <ul className="mt-4 space-y-2 pl-5 text-sm leading-relaxed text-white/70 list-disc">
          <li>
            Your financial ledgers, categories, and offline AI conversations are stored directly on your physical hardware. Zeno does not maintain a remote cloud copy of your transactions.
          </li>
          <li>
            You are exclusively responsible for safeguarding your Android device through biometric locks, PIN codes, device encryption, and secure physical custody.
          </li>
          <li>
            You are solely responsible for creating periodic exports or backups (e.g. CSV or JSON files). In the event of device loss, damage, theft, or factory reset, Zeno cannot recover your unbacked local data.
          </li>
        </ul>
      </section>

      {/* Section 6: User Verification & Accuracy of Records */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          6. User Verification of Financial Records
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          While Zeno is engineered to provide precise mathematical calculations and automated logging assistance, you acknowledge that all recorded entries (whether entered manually or detected via Smart Auto-Track) are subject to your review. You agree to inspect and verify recorded amounts, merchant categorizations, and balance tallies against your official bank, card, or payment provider statements. Zeno is not responsible for overdraft fees, billing errors, or disputes between you and third-party merchants or financial institutions.
        </p>
      </section>

      {/* Section 7: Zeno AI Assistant Limitations */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          7. Limitations of AI-Generated Insights
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
          <p>
            • <strong className="text-white">Informational Nature:</strong> Output generated by the Zeno AI assistant reflects algorithmic approximations based on historical data present in your local ledger.
          </p>
          <p>
            • <strong className="text-white">Possibility of Hallucinations or Inaccuracies:</strong> Natural language models may occasionally misinterpret nuance, produce incorrect mathematical derivations, or formulate inaccurate summaries. You must independently verify any critical spending threshold before executing financial transactions.
          </p>
          <p>
            • <strong className="text-white">No Professional Reliance:</strong> You agree not to rely on Zeno AI insights as a substitute for professional accounting, tax, legal, or financial counseling.
          </p>
        </div>
      </section>

      {/* Section 8: Smart Auto-Track & Android Permissions */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          8. Smart Auto-Track &amp; Operating System Dependencies
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          The Smart Auto-Track feature functions by reading incoming notifications via Android&rsquo;s <code className="rounded bg-white/10 px-1 py-0.5 text-amber-200">NotificationListenerService</code> API:
        </p>
        <ul className="mt-4 space-y-2 pl-5 text-sm leading-relaxed text-white/70 list-disc">
          <li>
            Smart Auto-Track requires your explicit permission in Android System Settings and can only detect notifications from banking and payment apps whose notification text formats are actively supported.
          </li>
          <li>
            Detection may fail or be interrupted if notifications are cleared, suppressed by Do Not Disturb, altered by third-party banking updates, or affected by OEM battery-saver task killers (e.g. aggressive background process termination).
          </li>
          <li>
            You agree not to use Smart Auto-Track on devices or accounts for which you are not the authorized account holder.
          </li>
        </ul>
      </section>

      {/* Section 9: Acceptable Use */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          9. Acceptable Use Policy
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          You agree not to:
        </p>
        <ul className="mt-4 space-y-2 pl-5 text-sm leading-relaxed text-white/70 list-disc">
          <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Zeno application, except to the extent permitted by applicable open-source licenses.</li>
          <li>Deploy automated scripts, bots, scrapers, or exploits against the Zeno marketing website or waitlist edge functions.</li>
          <li>Submit fraudulent, forged, or unauthorized email addresses or support requests.</li>
          <li>Circumvent or attempt to disable rate limiting, security headers, or access controls.</li>
          <li>Use Zeno for money laundering, terrorist financing, illicit trade, or any violation of local or international financial sanctions.</li>
        </ul>
      </section>

      {/* Section 10: Intellectual Property */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          10. Intellectual Property &amp; Branding
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          All intellectual property rights in the Zeno name, mascot illustration, brand assets, user interface designs, website graphics, and proprietary software code are owned exclusively by {operator.name} and its licensors. Nothing in these Terms grants you any right, title, or license to use our trademarks, brand logos, or commercial imagery without our prior written consent.
        </p>
      </section>

      {/* Section 11: Disclaimers & Warranties */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          11. Disclaimer of Warranties
        </h2>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 text-xs uppercase leading-relaxed text-white/70 tracking-wide">
          THE ZENO APPLICATION, WEBSITE, AI ASSISTANT, AND ALL ASSOCIATED MATERIALS ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, ZENO EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, NON-INFRINGEMENT, AND UNINTERRUPTED OR ERROR-FREE OPERATION.
        </div>
      </section>

      {/* Section 12: Limitation of Liability */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          12. Limitation of Liability
        </h2>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 text-xs uppercase leading-relaxed text-white/70 tracking-wide">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {operator.name}, ITS FOUNDERS, DIRECTORS, EMPLOYEES, AFFILIATES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA LOSS, DEVICE CORRUPTION, OVERDRAFT CHARGES, FINANCIAL MISCALCULATIONS, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE SOFTWARE. OUR TOTAL AGGREGATE LIABILITY UNDER THESE TERMS SHALL NOT EXCEED THE GREATER OF FIFTY US DOLLARS (USD $50) OR THE TOTAL AMOUNT PAID BY YOU TO ZENO (IF ANY) IN THE SIX MONTHS PRECEDING THE CLAIM.
        </div>
      </section>

      {/* Section 13: Governing Law & Dispute Resolution */}
      <section className="mb-10 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          13. Governing Law &amp; Dispute Resolution
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          These Terms and any dispute or controversy arising out of or related to them shall be governed by and construed in accordance with the laws of <span className="font-semibold text-white">{operator.jurisdiction}</span>, without giving effect to any principles of conflicts of law.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-white/60">
          In the event of any dispute, the parties agree to first attempt informal resolution in good faith by contacting our support team. If unresolved within sixty (60) days, disputes shall be submitted to the exclusive jurisdiction of the competent courts located within the designated operating jurisdiction.
        </p>
      </section>

      {/* Section 14: Contact Information */}
      <section className="mb-12 border-t border-white/[0.08] pt-8">
        <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          14. Contact Information
        </h2>
        <p className="mt-3 leading-relaxed text-white/70">
          If you have questions regarding these Terms or wish to report a violation, please contact us:
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-white/75">
          <p className="font-semibold text-white">{operator.name}</p>
          <p className="mt-1 text-xs text-white/60">Jurisdiction: {operator.jurisdiction}</p>
          <p className="text-xs text-white/60">Address: {operator.address}</p>
          <p className="mt-3 text-xs">
            Legal &amp; Compliance Inquiries:{' '}
            <span className="font-mono text-amber-200">{operator.supportEmail}</span>
          </p>
          <p className="text-xs">
            Web Support Portal:{' '}
            <Link href="/support" className="text-violet-soft underline hover:text-white">
              zeno.app/support
            </Link>
          </p>
        </div>
      </section>
    </LegalLayout>
  )
}
