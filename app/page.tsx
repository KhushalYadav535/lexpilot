import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { Header } from '@/components/landing/header'

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
