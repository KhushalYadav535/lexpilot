'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedMockup } from '@/components/landing/animated-mockup'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    const x = (clientX - left) / width - 0.5
    const y = (clientY - top) / height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 30, stiffness: 100 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 30, stiffness: 100 })

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-32 overflow-hidden bg-background text-foreground"
    >
      
      {/* Cinematic animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Dynamic mouse-tracking glow */}
        <motion.div 
          className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"
          style={{
            x: useTransform(mouseX, [-0.5, 0.5], ['-30%', '30%']),
            y: useTransform(mouseY, [-0.5, 0.5], ['-30%', '30%']),
            scale: 1.5,
            opacity: 0.5
          }}
        />

        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
        
        {/* Vignette fade for grid */}
        <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_20%,black_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl space-y-16">
        
        {/* Headline */}
        <div className="text-center space-y-8 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 backdrop-blur-md text-sm font-medium text-foreground mb-4 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Next-Generation Legal Intelligence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-6xl md:text-8xl font-bold tracking-tight text-balance leading-[1.1]"
          >
            Contract Analysis <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-gradient-x">
              Reimagined
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed font-light"
          >
            Instantly identify risks, analyze clauses, and get actionable recommendations powered by cutting-edge AI.
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8"
        >
          <Link href="/signup">
            <Button 
              size="lg" 
              className="group h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl px-10 rounded-full transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-14 text-base font-semibold border-border text-foreground bg-background hover:bg-secondary backdrop-blur-md px-10 rounded-full transition-all duration-300"
          >
            View Demo
          </Button>
        </motion.div>

        {/* Floating Mockup / Live Redline Animation */}
        <div className="perspective-1000 flex justify-center pt-16 pb-8 w-full z-20">
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX, rotateY }}
            className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(37,99,235,0.2)] overflow-hidden"
          >
            {/* Mac-like header bar */}
            <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            {/* Dark themed content container */}
            <div className="p-1 md:p-4 bg-gradient-to-b from-black/60 to-black/90">
               <div className="rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-[#050505]">
                 <AnimatedMockup />
               </div>
            </div>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 text-center border-t border-border"
        >
          {[
            { value: '500+', label: 'Contracts Analyzed' },
            { value: '99.8%', label: 'Accuracy Rate' },
            { value: '24/7', label: 'Instant Analysis' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="font-serif font-bold text-4xl md:text-5xl text-foreground">{stat.value}</p>
              <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>
        
      </div>
    </section>
  )
}
