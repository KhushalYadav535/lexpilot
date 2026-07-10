'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scale, DollarSign, ShieldAlert, CheckCircle2, Loader2, Bot } from 'lucide-react'

export function AgentLoader() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(s => (s < 3 ? s + 1 : s))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  const agents = [
    {
      id: 'legal',
      name: 'Legal Risk Agent',
      icon: Scale,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      tasks: ['Analyzing liability caps...', 'Reviewing governing law...', 'Cross-referencing playbooks...']
    },
    {
      id: 'finance',
      name: 'Finance Agent',
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      tasks: ['Extracting payment terms...', 'Calculating financial exposure...', 'Auditing penalties...']
    },
    {
      id: 'privacy',
      name: 'Compliance Agent',
      icon: ShieldAlert,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      tasks: ['Checking GDPR clauses...', 'Verifying Data Protection Addendum...', 'Assessing breach notification...']
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-8 w-full max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-serif font-bold flex items-center justify-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          Deploying Multi-Agent Workflow
        </h3>
        <p className="text-sm text-muted-foreground">Autonomous specialized agents are reviewing the contract.</p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon
          const isActive = index === activeStep
          const isDone = index < activeStep

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-500 ${
                isActive ? `${agent.border} ${agent.bg} shadow-lg ring-1 ring-primary/20` :
                isDone ? 'border-border/50 bg-secondary/20' : 'border-border/20 bg-secondary/5 opacity-50'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${agent.bg} ${agent.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className={`w-5 h-5 animate-spin ${agent.color}`} />
                ) : null}
              </div>

              <h4 className="text-sm font-semibold mb-2">{agent.name}</h4>
              
              <div className="h-12 flex flex-col justify-end">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.p
                      key={activeStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-muted-foreground"
                    >
                      {agent.tasks[Math.floor(Math.random() * agent.tasks.length)]}
                    </motion.p>
                  ) : isDone ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-emerald-500 font-medium"
                    >
                      Review complete
                    </motion.p>
                  ) : (
                    <p className="text-xs text-muted-foreground/50">Waiting...</p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="w-full max-w-sm h-1.5 bg-secondary rounded-full overflow-hidden mt-4">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${(activeStep / 3) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
