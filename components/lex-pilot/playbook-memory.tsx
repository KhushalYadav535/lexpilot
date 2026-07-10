'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Brain, Clock, ShieldCheck, Database, Loader2 } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

interface MemoryRule {
  id: number
  timestamp: string
  rule: string
  confidence: number
}

export function PlaybookMemory() {
  const [memory, setMemory] = useState<MemoryRule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMemory()
  }, [])

  const loadMemory = async () => {
    try {
      const data = await fetchAPI('/contracts/playbook/memory')
      setMemory(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Continuous Learning Memory
          </h2>
          <p className="text-muted-foreground mt-1">
            Rules automatically extracted by AI from accepted redlines and historical negotiations.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {memory.map((rule) => (
          <Card key={rule.id} className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  Learned Preference
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Confidence: {Math.round(rule.confidence * 100)}%
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(rule.timestamp).toLocaleString()}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rule.rule}
              </p>
            </CardContent>
          </Card>
        ))}

        {memory.length === 0 && (
          <div className="text-center p-12 border rounded-xl bg-secondary/10">
            <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">No learned rules yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Accept redlines in the dashboard to train the AI.</p>
          </div>
        )}
      </div>
    </div>
  )
}
