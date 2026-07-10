'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, GitCompare, AlertTriangle, CheckCircle2, PlusCircle } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

export function ComparisonViewer({ contract }: { contract?: any }) {
  const [playbooks, setPlaybooks] = useState<any[]>([])
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>('')
  const [isComparing, setIsComparing] = useState(false)
  const [results, setResults] = useState<{
    missing: any[],
    added: any[],
    modified: any[]
  } | null>(null)

  useEffect(() => {
    loadPlaybooks()
  }, [])

  const loadPlaybooks = async () => {
    try {
      const data = await fetchAPI('/playbooks')
      setPlaybooks(data)
      if (data.length > 0) setSelectedPlaybookId(data[0]._id)
    } catch (error) {
      console.error("Failed to load playbooks", error)
    }
  }

  const handleCompare = async () => {
    if (!contract || !selectedPlaybookId) return
    setIsComparing(true)
    setResults(null)
    try {
      const data = await fetchAPI('/compare', {
        method: 'POST',
        body: JSON.stringify({ contractId: contract._id || contract.id, playbookId: selectedPlaybookId })
      })
      setResults(data)
    } catch (error) {
      console.error(error)
      alert("Comparison failed.")
    } finally {
      setIsComparing(false)
    }
  }

  const handleCreateMockPlaybook = async () => {
    try {
      await fetchAPI('/playbooks', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Standard Enterprise NDA',
          textContent: '1. Confidential Information means any non-public info. 2. Receiving party shall not disclose it for 3 years. 3. Liability is capped at $50,000.'
        })
      })
      loadPlaybooks()
    } catch (error) {
      console.error(error)
    }
  }

  if (!contract) return <div>No contract selected.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select 
          className="flex-1 p-2 rounded-md border border-border bg-background"
          value={selectedPlaybookId}
          onChange={(e) => setSelectedPlaybookId(e.target.value)}
        >
          {playbooks.length === 0 ? <option value="">No Playbooks Available</option> : null}
          {playbooks.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
        
        {playbooks.length === 0 && (
          <Button variant="outline" onClick={handleCreateMockPlaybook}>Create Mock Playbook</Button>
        )}

        <Button onClick={handleCompare} disabled={isComparing || !selectedPlaybookId}>
          {isComparing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GitCompare className="w-4 h-4 mr-2" />}
          Run Comparison
        </Button>
      </div>

      {results && (
        <div className="space-y-6 animate-fadeInUp">
          
          {/* Missing Clauses */}
          {results.missing?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Missing Standard Clauses
              </h3>
              {results.missing.map((item, idx) => (
                <Card key={idx} className="p-4 border-destructive/20 bg-destructive/5">
                  <h4 className="font-medium text-destructive">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Modified Clauses */}
          {results.modified?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
                <GitCompare className="w-5 h-5" /> Modified Clauses
              </h3>
              {results.modified.map((item, idx) => (
                <Card key={idx} className="p-4 border-yellow-500/20 bg-yellow-500/5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-600 uppercase font-bold">{item.riskLevel} Risk</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-xs text-muted-foreground uppercase">Playbook Standard</p>
                      <p className="bg-background p-2 rounded border border-border">{item.playbookText}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-xs text-muted-foreground uppercase">In Contract</p>
                      <p className="bg-background p-2 rounded border border-border">{item.contractText}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                    <span className="font-semibold text-foreground">Impact:</span> {item.explanation}
                  </p>
                </Card>
              ))}
            </div>
          )}

          {/* Added Clauses */}
          {results.added?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-600 dark:text-blue-500 flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Extra Clauses (Not in Playbook)
              </h3>
              {results.added.map((item, idx) => (
                <Card key={idx} className="p-4 border-blue-500/20 bg-blue-500/5">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400">{item.title}</h4>
                  <p className="text-sm mt-1">{item.text}</p>
                </Card>
              ))}
            </div>
          )}

          {(!results.missing?.length && !results.modified?.length && !results.added?.length) && (
            <Card className="p-8 text-center text-green-600 border-green-600/20 bg-green-600/5">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <h3 className="text-xl font-semibold">Perfect Match</h3>
              <p className="text-sm opacity-80 mt-1">This contract perfectly aligns with the selected playbook.</p>
            </Card>
          )}

        </div>
      )}
    </div>
  )
}
