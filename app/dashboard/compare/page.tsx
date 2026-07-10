'use client'

import React from 'react'
import { ComparisonViewer } from '@/components/lex-pilot/comparison-viewer'

export default function ComparePage() {
  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0 z-10">
        <div>
          <h1 className="font-serif font-bold text-lg text-foreground">Contract Comparison</h1>
          <p className="text-xs text-muted-foreground">Compare active contract against Playbook standards or previous versions.</p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ComparisonViewer />
      </div>
    </div>
  )
}
