'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { RiskBadge, type RiskLevel } from './risk-badge'

interface ClauseCardProps {
  id: string
  title: string
  category?: string
  text: string
  riskLevel: RiskLevel
  explanation: string
  recommendation: string
}

export function ClauseCard({
  id,
  title,
  category,
  text,
  riskLevel,
  explanation,
  recommendation,
}: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="group">
      <Card className="card-premium overflow-hidden hover-lift cursor-pointer border-l-4 border-l-transparent transition-all duration-300"
        style={{
          borderLeftColor: isExpanded ? 'rgb(37, 99, 235)' : 'transparent',
          backgroundColor: isExpanded ? 'rgb(239, 246, 255)' : undefined
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-inset"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                {category && (
                  <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary/50">
                    {category}
                  </span>
                )}
              </div>
              <h3 className="font-serif font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{text}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <RiskBadge level={riskLevel} size="sm" />
              <div className="p-1.5 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                <ChevronDown
                  className={`w-5 h-5 text-foreground group-hover:text-primary transition-all duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-primary/20 bg-gradient-to-b from-primary/5 to-primary/2 p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Full clause text */}
            <div className="space-y-3">
              <h4 className="font-serif font-semibold text-foreground text-sm uppercase tracking-wide">Full Clause</h4>
              <div className="glass-soft p-4 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">{text}</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-3">
              <h4 className="font-serif font-semibold text-foreground text-sm uppercase tracking-wide">Analysis</h4>
              <div className="glass-soft p-4 rounded-lg border border-primary/10">
                <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <h4 className="font-serif font-semibold text-primary text-sm uppercase tracking-wide">Recommendation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium">{recommendation}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
