'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Scale } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl transition-all duration-500 rounded-full ${scrolled ? 'bg-background/80 backdrop-blur-xl border border-border shadow-sm' : 'bg-transparent border-transparent'}`}
    >
      <div className="px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-300">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-foreground">LexPilot</span>
        </Link>
        
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <Button className="button-premium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full px-6 font-semibold transition-all duration-300 hover:shadow-xl">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
