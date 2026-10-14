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

export default function App() {
  useEffect(() => refreshOnLoad(), [])

  return (
    <>
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
