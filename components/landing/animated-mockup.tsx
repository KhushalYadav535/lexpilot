'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ArrowRight, MousePointer2, Sparkles, Wand2, Check } from 'lucide-react'

export function AnimatedMockup() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timings = [
      1500, // 0: Idle
      1000, // 1: Cursor moves
      500,  // 2: Clicked/Selected
      2000, // 3: Scanning Document
      1000, // 4: AI Sidebar Opens
      1000, // 5: Highlight Risky Clause
      2000, // 6: AI Suggestion appears
      4000, // 7: Hold, then reset
    ]
    const timer = setTimeout(() => {
      setStep((s) => (s + 1) % timings.length)
    }, timings[step])
    return () => clearTimeout(timer)
  }, [step])

  return (
    <div className="relative w-full h-[500px] bg-[#0A0A0A] rounded-b-xl overflow-hidden flex font-sans border-t-0 text-white/90">
      
      {/* Sidebar - Contracts List */}
      <div className="w-64 border-r border-white/10 bg-white/[0.02] flex flex-col p-4 z-10 shrink-0 hidden md:flex">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Recent Documents</div>
        <div className="space-y-2">
          {['Master Service Agreement', 'NDA - Acme Corp', 'Employment Contract'].map((doc, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-lg flex items-center gap-3 text-sm transition-colors duration-300 ${
                i === 0 && step >= 2 ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-white/60 border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="truncate">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col bg-[#050505] overflow-hidden z-0">
        
        {/* Animated Scanner Line */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_4px_rgba(37,99,235,0.8)] z-50 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step < 2 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-white/30"
            >
              <div className="text-center space-y-4">
                <FileText className="w-12 h-12 mx-auto opacity-50" />
                <p>Select a document to begin</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="document"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 p-8 overflow-hidden"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">Master Service Agreement</h2>
                
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-serif">
                  <p>This Master Service Agreement ("Agreement") is entered into as of the Effective Date by and between the Provider and the Client.</p>
                  <p>1. Services. Provider agrees to perform the services described in the attached Statement of Work.</p>
                  
                  {/* The Target Clause */}
                  <div className={`p-1 -mx-1 rounded transition-colors duration-500 ${step >= 5 ? 'bg-red-500/10' : ''}`}>
                    <p className={`transition-all duration-500 ${step >= 5 ? 'text-red-400 line-through decoration-red-500/50' : ''}`}>
                      2. Limitation of Liability. Under no circumstances shall Provider be liable for any direct, indirect, incidental, or consequential damages. Provider's total liability under this agreement shall not exceed $100.
                    </p>
                  </div>
                  
                  <p>3. Confidentiality. Both parties agree to maintain the confidentiality of proprietary information.</p>
                  <p>4. Term and Termination. This Agreement shall commence on the Effective Date and continue until terminated by either party with 30 days written notice.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Sidebar */}
      <AnimatePresence>
        {step >= 4 && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-80 bg-[#0F0F0F] border-l border-white/10 absolute right-0 top-0 bottom-0 z-20 shadow-2xl flex flex-col"
          >
            <div className="h-14 border-b border-white/10 flex items-center px-4 bg-white/[0.02]">
              <Sparkles className="w-5 h-5 text-primary mr-2" />
              <span className="font-semibold text-white text-sm tracking-wide">LexPilot AI</span>
            </div>
            
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
              <AnimatePresence>
                {step >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Critical Risk</span>
                    </div>
                    
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                      The Limitation of Liability clause cap is severely below industry standard ($100). Suggesting a cap equal to 1x contract value.
                    </p>
                    
                    <div className="bg-[#050505] p-3 rounded-lg border border-white/5 mb-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      <p className="text-xs text-primary font-medium leading-relaxed pl-2">
                        Provider's total liability under this agreement shall be limited to the total fees paid by Client in the 12 months preceding the claim.
                      </p>
                    </div>

                    <button className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Accept Change
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Cursor */}
      <AnimatePresence>
        {step >= 1 && step <= 2 && (
          <motion.div
            initial={{ x: 500, y: 400, opacity: 0 }}
            animate={
              step === 1 
                ? { x: 120, y: 90, opacity: 1 } // Move to first doc in sidebar
                : { x: 120, y: 90, opacity: 1, scale: 0.8 } // Click
            }
            transition={{ duration: step === 1 ? 1 : 0.2, ease: "easeInOut" }}
            className="absolute z-50 pointer-events-none"
          >
            <MousePointer2 className="w-6 h-6 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] fill-black" />
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}
