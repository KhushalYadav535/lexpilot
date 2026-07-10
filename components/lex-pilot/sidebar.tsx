'use client'

import React from 'react'
import { CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react'

interface SidebarProps {
  contracts: any[]
  selectedId: string
  onSelect: (id: string) => void
}

const STATUS_CONFIG = {
  approved: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Approved' },
  flagged:  { icon: AlertCircle, color: 'text-red-500',     bg: 'bg-red-500/10 border-red-500/20',         label: 'Flagged' },
  review:   { icon: Clock,        color: 'text-amber-500',   bg: 'bg-amber-500/10 border-amber-500/20',      label: 'Review' },
} as const

export function Sidebar({ contracts, selectedId, onSelect }: SidebarProps) {
  return (
    <div className="w-full h-full flex flex-col bg-sidebar text-sidebar-foreground">
      {contracts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-muted-foreground opacity-50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No contracts yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Upload one to get started</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
          {contracts.map((c) => {
            const id = c._id || c.id
            const isSelected = id === selectedId
            const status = (c.status || 'review') as keyof typeof STATUS_CONFIG
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.review
            const Icon = cfg.icon
            const risk = c.riskScore || 0
            const riskColor = risk > 70 ? 'text-red-500' : risk > 40 ? 'text-amber-500' : 'text-emerald-500'

            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`w-full text-left px-3 py-3 rounded-xl flex items-start gap-3 transition-all duration-200 group ${
                  isSelected
                    ? 'bg-primary/10 border border-primary/20 shadow-sm'
                    : 'hover:bg-secondary/60 border border-transparent'
                }`}
              >
                <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary/20' : 'bg-secondary'}`}>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-semibold truncate leading-snug ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {c.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {c.counterparty || 'Unknown Counterparty'}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${riskColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${risk > 70 ? 'bg-red-500' : risk > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      Risk {risk}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
