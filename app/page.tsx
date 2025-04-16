import { LandingNavbar } from "@/components/landing-navbar"
import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingTestimonials } from "@/components/landing-testimonials"
import { LandingPricing } from "@/components/landing-pricing"
import { LandingFooter } from "@/components/landing-footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-grow">
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingPricing />
      </main>
      <LandingFooter />
    </div>
  )
}
