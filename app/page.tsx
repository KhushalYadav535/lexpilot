import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
