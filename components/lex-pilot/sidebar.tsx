'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RiskBadge } from './risk-badge'
import { FileText, BarChart3 } from 'lucide-react'
import type { Contract } from '@/lib/constants'

interface SidebarProps {
  contracts: Contract[]
  selectedId: string
  onSelect: (id: string) => void
}

export function Sidebar({ contracts, selectedId, onSelect }: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-serif font-bold text-lg text-foreground">Contracts</h2>
        <p className="text-xs text-muted-foreground mt-1">{contracts.length} documents</p>
      </div>

      {/* Contract List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2">
          {contracts.map((contract) => (
            <button
              key={contract.id}
              onClick={() => onSelect(contract.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedId === contract.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'border-border hover:bg-secondary text-foreground'
              }`}
            >
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{contract.title}</p>
                  <p className="text-xs opacity-70">{contract.date}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-border bg-secondary/30">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Clauses</span>
            <span className="font-semibold text-foreground">24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">At Risk</span>
            <span className="font-semibold text-lex-risk-critical">5</span>
          </div>
        </div>
      </div>
    </div>
  )
}
