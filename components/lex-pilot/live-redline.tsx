'use client'

import React from 'react'

export function LiveRedline() {
  const oldText = 'The Company shall provide services as specified herein.'
  const newText = 'The Company shall provide premium legal services as specified herein.'

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Animated redline signature element */}
      <div className="space-y-6">
        {/* Before */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Original</h3>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-foreground leading-relaxed">
              The Company shall provide services as specified herein.
            </p>
          </div>
        </div>

        {/* Animated arrow */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
          </div>
        </div>

        {/* After with diff highlighting */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Updated</h3>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border relative overflow-hidden">
            <div className="relative">
              <p className="text-foreground leading-relaxed">
                The Company shall provide{' '}
                <span className="relative">
                  <span className="absolute inset-0 bg-lex-risk-low/20 rounded" style={{ bottom: '2px' }} />
                  <span className="relative font-medium text-lex-success">premium legal</span>
                </span>{' '}
                services as specified herein.
              </p>
            </div>
            {/* Animated line underneath the addition */}
            <div className="mt-1 h-0.5 bg-gradient-to-r from-transparent via-lex-success to-transparent opacity-50 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Change summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lex-risk-low/10 text-lex-success font-medium">
            <span className="w-2 h-2 rounded-full bg-lex-success" />
            Enhanced to &quot;premium legal&quot;
          </span>
        </div>
      </div>
    </div>
  )
}
