'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, FileSearch, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

interface MultiDocReviewProps {
  allContracts: any[]
}

const SEVERITY_COLOR: Record<string, string> = {
  high:     'bg-red-500/10 text-red-600 border-red-500/20',
  medium:   'bg-amber-500/10 text-amber-600 border-amber-500/20',
  low:      'bg-blue-500/10 text-blue-600 border-blue-500/20',
  critical: 'bg-red-700/10 text-red-700 border-red-700/20',
}

export function MultiDocReview({ allContracts }: MultiDocReviewProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [open, setOpen] = useState(false)

  const toggleContract = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleRun = async () => {
    if (selected.length < 2) return
    setIsRunning(true)
    setResults(null)
    try {
      const data = await fetchAPI('/contracts/multi-review', {
        method: 'POST',
        body: JSON.stringify({ contractIds: selected })
      })
      setResults(data)
    } catch (err) {
      console.error(err)
      alert('Multi-document review failed.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileSearch className="w-4 h-4" />
          Multi-Doc Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="font-serif text-xl">Multi-Document Review</DialogTitle>
          <p className="text-sm text-muted-foreground">Select 2 or more contracts to identify inconsistencies and conflicts.</p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Contract selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Select Contracts ({selected.length} selected)</h3>
            {allContracts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contracts available. Upload at least 2 contracts first.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {allContracts.map((c: any) => {
                  const id = c._id || c.id
                  const isSelected = selected.includes(id)
                  return (
                    <button
                      key={id}
                      onClick={() => toggleContract(id)}
                      className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${
                        isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{c.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{c.status}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <Button
            onClick={handleRun}
            disabled={isRunning || selected.length < 2}
            className="w-full"
            size="lg"
          >
            {isRunning
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing {selected.length} documents…</>
              : <><FileSearch className="w-4 h-4 mr-2" />Run Multi-Document Review ({selected.length} docs)</>
            }
          </Button>

          {results && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              {/* AI Summary */}
              {results.summary && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h3 className="font-semibold text-sm mb-2 text-primary">AI Overall Assessment</h3>
                  <p className="text-sm text-muted-foreground">{results.summary}</p>
                </Card>
              )}

              {/* Inconsistencies */}
              {results.inconsistencies?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    {results.inconsistencies.length} Inconsistencies Found
                  </h3>
                  {results.inconsistencies.map((item: any, i: number) => (
                    <Card key={i} className={`p-4 border ${SEVERITY_COLOR[item.severity] || SEVERITY_COLOR.medium} space-y-2`}>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <Badge variant="outline" className={`text-xs ${SEVERITY_COLOR[item.severity] || SEVERITY_COLOR.medium}`}>{item.severity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.documents && (
                        <p className="text-xs text-muted-foreground">Affects: {item.documents.join(', ')}</p>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              {/* Missing clauses */}
              {results.missing?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-amber-500" />
                    Missing Clauses in Some Documents
                  </h3>
                  {results.missing.map((item: any, i: number) => (
                    <Card key={i} className="p-4 border-amber-500/20 bg-amber-500/5">
                      <p className="font-medium text-sm">{item.clause}</p>
                      <p className="text-xs text-muted-foreground mt-1">Missing from: {(item.missingFrom || []).join(', ')}</p>
                    </Card>
                  ))}
                </div>
              )}

              {!results.inconsistencies?.length && !results.missing?.length && (
                <Card className="p-8 text-center text-green-600 border-green-500/20 bg-green-500/5">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold">All Documents Are Consistent</h3>
                  <p className="text-sm text-muted-foreground mt-1">No major inconsistencies detected across the selected contracts.</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
