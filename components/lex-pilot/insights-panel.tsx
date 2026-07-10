'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, TrendingUp, CheckCircle2, ThumbsUp, ThumbsDown, Loader2, ShieldAlert, Bot, Database } from 'lucide-react'
import type { Contract } from '@/lib/constants'
import { fetchAPI } from '@/lib/api'

interface InsightsPanelProps {
  contract: Contract
  userRole?: string
  onContractUpdate?: (updated: any) => void
}

export function InsightsPanel({ contract, userRole, onContractUpdate }: InsightsPanelProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  // Dynamically compute issues from clauses
  const clauses = contract.clauses || []
  const criticalCount = contract.summary?.criticalIssues ?? clauses.filter(c => c.riskLevel === 'critical').length
  const highCount     = contract.summary?.highIssues     ?? clauses.filter(c => c.riskLevel === 'high').length
  const mediumCount   = contract.summary?.mediumIssues   ?? clauses.filter(c => c.riskLevel === 'medium').length
  const lowCount      = clauses.filter(c => c.riskLevel === 'low').length

  const riskScore = (contract as any).riskScore || 0

  const summaryItems = [
    { label: 'Critical', value: criticalCount, color: 'text-red-600', bg: 'bg-red-500/10 border-red-500/20',    icon: AlertTriangle },
    { label: 'High',     value: highCount,     color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20', icon: AlertTriangle },
    { label: 'Medium',   value: mediumCount,   color: 'text-amber-500',  bg: 'bg-amber-500/10 border-amber-500/20',  icon: AlertTriangle },
    { label: 'Low',      value: lowCount,      color: 'text-blue-500',   bg: 'bg-blue-500/10 border-blue-500/20',   icon: ShieldAlert  },
  ]

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      const updated = await fetchAPI(`/contracts/${(contract as any)._id || contract.id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ notes: 'Approved via dashboard' })
      })
      onContractUpdate?.(updated)
    } catch (e) { console.error(e) }
    finally { setIsApproving(false) }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    try {
      const updated = await fetchAPI(`/contracts/${(contract as any)._id || contract.id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ notes: 'Flagged via dashboard' })
      })
      onContractUpdate?.(updated)
    } catch (e) { console.error(e) }
    finally { setIsRejecting(false) }
  }

  const status = (contract as any).status

  return (
    <div className="h-full flex flex-col bg-sidebar border-l border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h3 className="font-serif font-bold text-sm text-foreground">Analysis Summary</h3>
        {riskScore > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${riskScore > 70 ? 'bg-red-500' : riskScore > 40 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <span className={`text-xs font-bold tabular-nums ${riskScore > 70 ? 'text-red-500' : riskScore > 40 ? 'text-amber-500' : 'text-green-500'}`}>
              {riskScore}/100
            </span>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {/* Risk Counts */}
        <div className="grid grid-cols-2 gap-1.5">
          {summaryItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className={`rounded-xl border p-2.5 ${item.bg}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3 h-3 ${item.color}`} />
                  <span className="text-[10px] text-muted-foreground font-medium">{item.label}</span>
                </div>
                <span className={`font-bold text-xl tabular-nums ${item.color}`}>{item.value}</span>
              </div>
            )
          })}
        </div>

        {/* Recommendations from AI */}
        {clauses.length > 0 && (
          <div className="pt-3 border-t border-border">
            <h4 className="font-serif font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-3 flex items-center justify-between">
              Top Recommendations
              <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">XAI Enabled</span>
            </h4>
            <div className="space-y-4">
              {clauses
                .filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high')
                .slice(0, 3)
                .map((c, i) => (
                  <div key={i} className="text-xs text-muted-foreground leading-relaxed flex flex-col gap-1.5 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <span className="font-semibold text-foreground">• {c.title}: </span>
                      {c.recommendation}
                    </div>
                    {/* Explainable AI Metadata */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {c.agent && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                          <Bot className="w-2.5 h-2.5" /> {c.agent}
                        </span>
                      )}
                      {c.confidenceScore && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          Confidence: {Math.round(c.confidenceScore * 100)}%
                        </span>
                      )}
                    </div>
                    {c.vectorCitation && (
                      <div className="text-[10px] text-muted-foreground bg-secondary/30 p-1.5 rounded flex items-start gap-1.5">
                        <Database className="w-3 h-3 mt-0.5 shrink-0 text-primary opacity-70" />
                        <span className="truncate" title={c.vectorCitation}>{c.vectorCitation}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Approval Workflow (admin/legal only) */}
        {(userRole === 'admin' || userRole === 'legal') && (
          <div className="pt-3 border-t border-border">
            <h4 className="font-serif font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-3">Approval Workflow</h4>
            <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-semibold text-center ${
              status === 'approved' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
              status === 'flagged'  ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
              'bg-amber-500/10 text-amber-600 border border-amber-500/20'
            }`}>
              Status: {status === 'approved' ? '✓ Approved' : status === 'flagged' ? '✗ Flagged / Rejected' : '⏳ Pending Review'}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                onClick={handleApprove}
                disabled={isApproving || status === 'approved'}
              >
                {isApproving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <ThumbsUp className="w-3 h-3 mr-1" />}
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10 text-xs"
                onClick={handleReject}
                disabled={isRejecting || status === 'flagged'}
              >
                {isRejecting ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <ThumbsDown className="w-3 h-3 mr-1" />}
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
