'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, ShieldCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

const FRAMEWORKS = [
  { id: 'GDPR',      label: 'GDPR',        description: 'EU General Data Protection Regulation' },
  { id: 'CCPA',      label: 'CCPA',        description: 'California Consumer Privacy Act' },
  { id: 'HIPAA',     label: 'HIPAA',       description: 'Health Insurance Portability & Accountability' },
  { id: 'SOC2',      label: 'SOC 2',       description: 'Service Organization Control 2' },
  { id: 'ISO27001',  label: 'ISO 27001',   description: 'Information Security Management' },
  { id: 'AI Act',    label: 'EU AI Act',   description: 'European Union AI Act' },
  { id: 'DPDP',      label: 'DPDP (India)', description: 'Digital Personal Data Protection Act' },
  { id: 'UK GDPR',   label: 'UK GDPR',     description: 'United Kingdom GDPR (Post-Brexit)' },
]

const SEVERITY_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  high:     { color: 'border-red-500/30 bg-red-500/5',    icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
  medium:   { color: 'border-amber-500/30 bg-amber-500/5', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
  low:      { color: 'border-blue-500/30 bg-blue-500/5',  icon: <Info className="w-4 h-4 text-blue-500" /> },
  critical: { color: 'border-red-700/30 bg-red-700/5',    icon: <AlertTriangle className="w-4 h-4 text-red-700" /> },
}

interface Violation {
  framework: string
  issue: string
  severity: string
  recommendation: string
}

export function CompliancePanel({ contract }: { contract?: any }) {
  const [selected, setSelected] = useState<string[]>(['GDPR'])
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<{ violations: Violation[] } | null>(null)

  const toggleFramework = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const handleCheck = async () => {
    if (!contract || selected.length === 0) return
    setIsChecking(true)
    setResults(null)
    try {
      const data = await fetchAPI(`/contracts/${contract._id || contract.id}/compliance`, {
        method: 'POST',
        body: JSON.stringify({ frameworks: selected })
      })
      setResults(data)
    } catch (err) {
      console.error(err)
      alert('Compliance check failed. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold tracking-tight">AI Compliance Review</h2>
        <p className="text-muted-foreground mt-1">Check this contract against regulatory frameworks.</p>
      </div>

      {/* Framework Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Select Frameworks to Check</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {FRAMEWORKS.map(fw => (
            <button
              key={fw.id}
              onClick={() => toggleFramework(fw.id)}
              className={`text-left p-3 rounded-lg border text-sm transition-all ${
                selected.includes(fw.id)
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/50'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="font-semibold block">{fw.label}</span>
              <span className="text-xs text-muted-foreground">{fw.description}</span>
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleCheck}
        disabled={isChecking || selected.length === 0 || !contract}
        className="w-full"
        size="lg"
      >
        {isChecking
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running Compliance Check…</>
          : <><ShieldCheck className="w-4 h-4 mr-2" />Run Compliance Check ({selected.length} frameworks)</>
        }
      </Button>

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {results.violations.length === 0 ? (
            <Card className="p-8 text-center border-green-500/30 bg-green-500/5">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">Full Compliance</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No violations found against the selected frameworks.
              </p>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold">{results.violations.length} issue{results.violations.length !== 1 ? 's' : ''} found</h3>
              </div>
              {results.violations.map((v, idx) => {
                const cfg = SEVERITY_CONFIG[v.severity] || SEVERITY_CONFIG.medium
                return (
                  <Card key={idx} className={`p-4 border ${cfg.color} space-y-2`}>
                    <div className="flex items-center gap-2">
                      {cfg.icon}
                      <Badge variant="outline" className="text-xs font-semibold">{v.framework}</Badge>
                      <Badge variant="outline" className={`text-xs uppercase ${
                        v.severity === 'high' || v.severity === 'critical' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                        v.severity === 'medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      }`}>{v.severity}</Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{v.issue}</p>
                    <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">Recommendation: </span>
                        {v.recommendation}
                      </p>
                    </div>
                  </Card>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}
