import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskBadge } from './risk-badge'
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react'
import type { Contract } from '@/lib/constants'

interface InsightsPanelProps {
  contract: Contract
}

export function InsightsPanel({ contract }: InsightsPanelProps) {
  const summaryItems = [
    {
      label: 'Critical Issues',
      value: contract.summary.criticalIssues,
      icon: AlertTriangle,
      color: 'text-lex-risk-critical',
    },
    {
      label: 'High Issues',
      value: contract.summary.highIssues,
      icon: TrendingUp,
      color: 'text-lex-risk-high',
    },
    {
      label: 'Medium Issues',
      value: contract.summary.mediumIssues,
      icon: AlertTriangle,
      color: 'text-lex-risk-medium',
    },
  ]

  return (
    <div className="h-full flex flex-col bg-sidebar border-l border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-serif font-bold text-lg text-foreground">Analysis Summary</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Risk Summary */}
        <div className="space-y-3">
          {summaryItems.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label} className="border-border bg-secondary/30">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recommendations */}
        <div className="pt-4 border-t border-border">
          <h4 className="font-serif font-semibold text-sm text-foreground mb-3">Key Recommendations</h4>
          <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              • <strong>Priority 1:</strong> Revise the Limitation of Liability clause to include a cap on total
              damages
            </p>
            <p>
              • <strong>Priority 2:</strong> Narrow the scope of indemnification obligations
            </p>
            <p>
              • <strong>Priority 3:</strong> Add minimum term requirement for early termination penalties
            </p>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="pt-4 border-t border-border">
          <h4 className="font-serif font-semibold text-sm text-foreground mb-3">Compliance Status</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-lex-success" />
              <span className="text-foreground">GDPR Compliance</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-lex-success" />
              <span className="text-foreground">Data Protection</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-lex-risk-high" />
              <span className="text-foreground">Liability Limits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
