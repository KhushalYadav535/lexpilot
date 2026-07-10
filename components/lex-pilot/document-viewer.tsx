'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClauseCard } from './clause-card'
import { Filter, ChevronDown } from 'lucide-react'
import type { Contract, RiskLevel } from '@/lib/constants'

interface DocumentViewerProps {
  contract: Contract
}

const RISK_LEVELS: RiskLevel[] = ['critical', 'high', 'medium', 'low']

export function DocumentViewer({ contract }: DocumentViewerProps) {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const filteredClauses =
    selectedRisk === 'all' ? contract.clauses : contract.clauses.filter((c) => c.riskLevel === selectedRisk)

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-primary/2 to-background overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-primary/10 glass-soft">
        <h2 className="font-serif text-3xl font-bold text-gradient mb-4">{contract.title}</h2>
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-8 text-sm">
            <div className="glass-soft px-4 py-3 rounded-lg">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Date</p>
              <p className="font-semibold text-foreground">{contract.date}</p>
            </div>
            <div className="glass-soft px-4 py-3 rounded-lg">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Status</p>
              <p className="font-semibold text-foreground capitalize">{contract.status}</p>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg button-premium bg-primary/10 hover:bg-primary/20 border border-primary/20 font-semibold text-sm transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium capitalize">
                {selectedRisk === 'all' ? 'All Clauses' : `${selectedRisk} Risk`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 glass rounded-xl shadow-2xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setSelectedRisk('all')
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm rounded-lg font-medium transition-all duration-200 ${
                      selectedRisk === 'all'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'hover:bg-primary/10 text-foreground'
                    }`}
                  >
                    All Clauses
                  </button>
                  {RISK_LEVELS.map((risk) => (
                    <button
                      key={risk}
                      onClick={() => {
                        setSelectedRisk(risk)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm capitalize rounded-lg font-medium transition-all duration-200 ${
                        selectedRisk === risk
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'hover:bg-primary/10 text-foreground'
                      }`}
                    >
                      {risk} Risk
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clauses List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4 max-w-3xl">
          {filteredClauses.length > 0 ? (
            filteredClauses.map((clause, idx) => (
              <div key={clause.id} style={{ animationDelay: `${idx * 0.05}s` }} className="animate-fadeInUp">
                <ClauseCard {...clause} />
              </div>
            ))
          ) : (
            <Card className="card-premium p-8 text-center">
              <p className="text-muted-foreground text-lg">No clauses with <span className="font-semibold">{selectedRisk}</span> risk found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
