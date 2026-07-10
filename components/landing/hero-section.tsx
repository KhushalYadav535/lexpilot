import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LiveRedline } from '@/components/lex-pilot/live-redline'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" />

      <div className="relative w-full max-w-5xl space-y-12">
        {/* Headline */}
        <div className="text-center space-y-6 animate-fadeInUp">
          <div className="inline-block px-4 py-2 glass rounded-full text-sm font-semibold text-primary/90 mb-4">
            ✨ AI-Powered Legal Intelligence
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold text-foreground text-balance leading-tight">
            Contract Analysis <span className="text-gradient">Reimagined</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Instantly identify risks, analyze clauses, and get actionable recommendations powered by cutting-edge AI
          </p>
        </div>

        {/* Live Redline Animation */}
        <div className="flex justify-center py-8 animate-slideInLeft">
          <div className="glass rounded-2xl p-1 shadow-2xl">
            <LiveRedline />
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideInRight">
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="gap-2 text-base font-semibold button-premium bg-primary hover:bg-primary/90 shadow-lg"
            >
              Try LexPilot Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-base font-semibold button-premium border-2 hover:bg-primary/10"
          >
            View Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 py-8 text-center">
          {[
            { value: '500+', label: 'Contracts Analyzed' },
            { value: '99.8%', label: 'Accuracy Rate' },
            { value: '24/7', label: 'Instant Analysis' }
          ].map((stat, i) => (
            <div 
              key={i}
              className="card-premium p-6 hover-lift"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="font-serif font-bold text-2xl md:text-3xl text-primary mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
