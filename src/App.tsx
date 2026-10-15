import { useEffect } from 'react'
import { Faq } from './components/faq/Faq'
import { StillQuestions } from './components/faq/StillQuestions'
import { BenefitsSlider } from './components/feature-sections/BenefitsSlider'
import { FeatureOverview } from './components/feature-sections/FeatureOverview'
import { ShowcasePinned } from './components/feature-sections/ShowcasePinned'
import { Footer } from './components/footer/Footer'
import { Hero } from './components/hero/Hero'
import { Navbar } from './components/navigation/Navbar'
import { Premium } from './components/premium-section/Premium'
import { FinalCta } from './components/waitlist/FinalCta'
import { refreshOnLoad } from './lib/motion'
import { PageMeta, RouterProvider, useRouter } from './lib/router'
import { ContactSupport } from './pages/ContactSupport'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { ResearchOnboarding } from './pages/ResearchOnboarding'
import { TermsOfUse } from './pages/TermsOfUse'

function LandingPage() {
  useEffect(() => refreshOnLoad(), [])

  return (
    <>
      <PageMeta
        title="Zeno — Stop Guessing Where Your Money Goes"
        description="Track expenses, understand your spending, and make better money decisions with Zeno. Local-first personal finance with on-device AI."
      />
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <FeatureOverview />
        <ShowcasePinned />
        <BenefitsSlider />
        <Premium />
        <Faq />
        <StillQuestions />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

function Routes() {
  const { path } = useRouter()

  switch (path) {
    case '/privacy':
      return <PrivacyPolicy />
    case '/terms':
      return <TermsOfUse />
    case '/support':
      return <ContactSupport />
    case '/research':
      return <ResearchOnboarding />
    default:
      return <LandingPage />
  }
}

export default function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  )
}

