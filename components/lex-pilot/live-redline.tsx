'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X, ArrowRight, Loader2, Wand2 } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

interface Clause {
  id: string
  title: string
  text: string
  riskLevel: string
}

export function LiveRedline({ contract }: { contract?: any }) {
  const [selectedClause, setSelectedClause] = useState<Clause | null>(
    contract?.clauses?.[0] || null
  )
  const [instruction, setInstruction] = useState('Make it more favorable to our side')
  const [isGenerating, setIsGenerating] = useState(false)
  const [redlineResult, setRedlineResult] = useState<{
    original: string
    revised: string
    explanation: string
  } | null>(null)
  const [learningMessage, setLearningMessage] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)

  if (!contract) return <div>No contract selected.</div>

  const handleGenerate = async () => {
    if (!selectedClause) return
    setIsGenerating(true)
    setRedlineResult(null)
    
    try {
      const data = await fetchAPI(`/contracts/${contract._id || contract.id}/redline`, {
        method: 'POST',
        body: JSON.stringify({
          clauseText: selectedClause.text,
          instruction
        })
      })
      setRedlineResult(data)
    } catch (error) {
      console.error(error)
      alert("Failed to generate redline.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAccept = async () => {
    if (!selectedClause || !redlineResult) return
    setIsAccepting(true)
    try {
      await fetchAPI('/contracts/playbook/learn', {
        method: 'POST',
        body: JSON.stringify({
          clauseId: selectedClause.title,
          acceptedText: redlineResult.revised,
          explanation: redlineResult.explanation
        })
      })
      setLearningMessage("Playbook Updated: System learned your new preference.")
      setTimeout(() => {
        setRedlineResult(null)
        setLearningMessage(null)
      }, 3000)
    } catch (error) {
      console.error(error)
      alert("Failed to save learning.")
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <label className="text-sm font-medium">Select Clause to Redline</label>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
            {contract.clauses?.map((c: Clause) => (
              <button
                key={c.id}
                onClick={() => { setSelectedClause(c); setRedlineResult(null); }}
                className={`text-left p-3 rounded-lg border text-sm transition-all ${
                  selectedClause?.id === c.id 
                    ? 'border-primary bg-primary/10 font-medium' 
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="text-sm font-medium">Redline Instruction</label>
          <Input 
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Cap liability at 1x contract value"
          />
          <Button onClick={handleGenerate} disabled={isGenerating || !selectedClause} className="w-full">
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
            Generate AI Redline
          </Button>

          {redlineResult && (
            <Card className="p-4 mt-4 glass border-primary/20 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Original</h4>
                <p className="text-sm line-through text-destructive/80">{redlineResult.original}</p>
              </div>
              <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-muted-foreground" /></div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">AI Suggestion</h4>
                <p className="text-sm text-primary font-medium">{redlineResult.revised}</p>
              </div>
              <div className="bg-secondary/20 p-3 rounded-md">
                <p className="text-xs text-muted-foreground"><span className="font-semibold">Reasoning:</span> {redlineResult.explanation}</p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleAccept}
                  disabled={isAccepting}
                >
                  {isAccepting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  Accept & Learn
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setRedlineResult(null)} disabled={isAccepting}>
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
              {learningMessage && (
                <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-md text-xs flex items-center justify-center font-medium animate-in fade-in zoom-in">
                  <Wand2 className="w-3 h-3 mr-1" /> {learningMessage}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
