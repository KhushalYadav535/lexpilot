'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, GitCompare, PlusCircle, MinusCircle, AlertTriangle } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

interface VersionComparisonProps {
  contract: any
  allContracts: any[]
}

export function VersionComparison({ contract, allContracts }: VersionComparisonProps) {
  const others = allContracts.filter(c => (c._id || c.id) !== (contract._id || contract.id))
  const [secondId, setSecondId] = useState<string>(others[0]?._id || others[0]?.id || '')
  const [isComparing, setIsComparing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleCompare = async () => {
    if (!secondId) return
    setIsComparing(true)
    setResults(null)
    try {
      const data = await fetchAPI('/contracts/compare-versions', {
        method: 'POST',
        body: JSON.stringify({
          contractIdA: contract._id || contract.id,
          contractIdB: secondId,
        })
      })
      setResults(data)
    } catch (err) {
      console.error(err)
      alert('Version comparison failed.')
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Version A (Current)</p>
          <div className="p-2.5 rounded-md border border-border bg-secondary/30 text-sm font-medium truncate">
            {contract.title}
          </div>
        </div>
        <GitCompare className="w-5 h-5 text-muted-foreground shrink-0 mt-4" />
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Version B (Compare With)</p>
          {others.length === 0 ? (
            <div className="p-2.5 rounded-md border border-dashed border-border text-sm text-muted-foreground">
              Upload another contract to compare
            </div>
          ) : (
            <select
              className="w-full p-2.5 rounded-md border border-border bg-background text-sm"
              value={secondId}
              onChange={e => setSecondId(e.target.value)}
            >
              {others.map((c: any) => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <Button
        onClick={handleCompare}
        disabled={isComparing || !secondId}
        className="w-full"
        size="lg"
      >
        {isComparing
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Comparing…</>
          : <><GitCompare className="w-4 h-4 mr-2" />Compare Versions</>
        }
      </Button>

      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Added clauses */}
          {results.added?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Added in Version B
              </h3>
              {results.added.map((item: any, i: number) => (
                <Card key={i} className="p-4 border-emerald-500/20 bg-emerald-500/5">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.text}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Removed clauses */}
          {results.removed?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                <MinusCircle className="w-5 h-5" /> Removed in Version B
              </h3>
              {results.removed.map((item: any, i: number) => (
                <Card key={i} className="p-4 border-red-500/20 bg-red-500/5">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.text}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Modified clauses */}
          {results.modified?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Modified Clauses
              </h3>
              {results.modified.map((item: any, i: number) => (
                <Card key={i} className="p-4 border-amber-500/20 bg-amber-500/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{item.title}</p>
                    {item.riskLevel && (
                      <Badge variant="outline" className={`text-xs uppercase ${
                        item.riskLevel === 'high' || item.riskLevel === 'critical' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>{item.riskLevel} risk</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-muted-foreground uppercase tracking-wide mb-1">Version A</p>
                      <p className="bg-background p-2 rounded border">{item.textA || item.playbookText}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground uppercase tracking-wide mb-1">Version B</p>
                      <p className="bg-background p-2 rounded border">{item.textB || item.contractText}</p>
                    </div>
                  </div>
                  {item.explanation && (
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                      <span className="font-semibold text-foreground">Impact: </span>{item.explanation}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}

          {!results.added?.length && !results.removed?.length && !results.modified?.length && (
            <Card className="p-8 text-center text-emerald-600 border-emerald-500/20 bg-emerald-500/5">
              <p className="text-lg font-semibold">No Differences Found</p>
              <p className="text-sm text-muted-foreground mt-1">These two contracts appear to have the same content.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
