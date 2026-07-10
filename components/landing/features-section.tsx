'use client'

import { Brain, Shield, Lightbulb, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: Brain,
    title: 'Intelligent Analysis',
    description: 'Advanced AI algorithms analyze every clause for legal risks, contradictions, and unfavorable terms. Get instant insights into contract complexities.',
    color: 'from-blue-500/20 to-purple-500/20'
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Automatic risk categorization from critical to low. Understand which clauses pose the greatest exposure to your business.',
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: Lightbulb,
    title: 'Smart Recommendations',
    description: 'Actionable recommendations based on industry standards. Know exactly what to negotiate or modify to protect your interests.',
    color: 'from-pink-500/20 to-red-500/20'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get comprehensive analysis in seconds. No more hours spent reviewing dense legal documents. Focus on strategy, not reading.',
    color: 'from-emerald-500/20 to-blue-500/20'
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

export function FeaturesSection() {
  return (
    <section className="relative py-32 px-4 bg-background overflow-hidden" id="features">
      {/* Cinematic animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-24">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">LexPilot?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Powerful features designed to transform contract review from hours to seconds. Experience the future of legal tech.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={item}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group relative rounded-3xl border border-border bg-card/50 backdrop-blur-md p-8 md:p-10 overflow-hidden transition-all duration-500 hover:bg-secondary/50 hover:border-border/80"
              >
                {/* Glowing backdrop matching the icon's gradient color */}
                <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${feature.color} rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                <div className="relative z-10 flex flex-col items-start gap-6">
                  <div className="p-4 rounded-2xl bg-secondary border border-border group-hover:bg-primary/10 transition-colors duration-500 shadow-sm">
                    <Icon className="w-8 h-8 text-foreground group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-foreground tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg font-light group-hover:text-foreground/80 transition-colors duration-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
