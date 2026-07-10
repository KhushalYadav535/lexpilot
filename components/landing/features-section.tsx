import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Brain, Shield, Lightbulb } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'Intelligent Analysis',
    description:
      'Advanced AI algorithms analyze every clause for legal risks, contradictions, and unfavorable terms. Get instant insights into contract complexities.',
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description:
      'Automatic risk categorization from critical to low. Understand which clauses pose the greatest exposure to your business.',
  },
  {
    icon: Lightbulb,
    title: 'Smart Recommendations',
    description:
      'Actionable recommendations based on industry standards. Know exactly what to negotiate or modify to protect your interests.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Get comprehensive analysis in seconds. No more hours spent reviewing dense legal documents. Focus on strategy, not reading.',
  },
]

export function FeaturesSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 animate-pulse" />

      <div className="relative max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4 animate-fadeInUp">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Why Choose <span className="text-gradient">LexPilot?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to transform contract review from hours to seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="card-premium p-8 hover-lift group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
