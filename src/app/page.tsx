import { Navbar }         from '@/components/layout/navbar'
import { Footer }         from '@/components/layout/footer'
import { StickyBookBar }  from '@/components/layout/sticky-book-bar'
import { Hero }           from '@/components/landing/hero'
import { ValueProps }     from '@/components/landing/value-props'
import { HowItWorks }     from '@/components/landing/how-it-works'
import { Courses }        from '@/components/landing/courses'
import { Pricing }        from '@/components/landing/pricing'
import { TutorSpotlight } from '@/components/landing/tutor-spotlight'
import { Testimonials }   from '@/components/landing/testimonials'
import { FAQ }            from '@/components/landing/faq'
import { CTABanner }      from '@/components/landing/cta-banner'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <HowItWorks />
        <Courses />
        <Pricing />
        <TutorSpotlight />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
      <StickyBookBar />
    </>
  )
}
