'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, AlertCircle, DollarSign, ShieldCheck, PackageCheck } from 'lucide-react'

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  Financial:   { icon: <DollarSign className="w-4 h-4 text-emerald-500" />, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  Deliverable: { icon: <PackageCheck className="w-4 h-4 text-blue-500" />,  color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  Notice:      { icon: <AlertCircle className="w-4 h-4 text-amber-500" />,  color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  Compliance:  { icon: <ShieldCheck className="w-4 h-4 text-purple-500" />, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  Payment:     { icon: <DollarSign className="w-4 h-4 text-green-500" />,   color: 'bg-green-500/10 text-green-600 border-green-500/20' },
}

export function ObligationsList({ contract }: { contract?: any }) {
  const obligations = contract?.obligations || []

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold tracking-tight">Obligations Tracker</h2>
        <p className="text-muted-foreground mt-1">AI-extracted commitments and deadlines</p>
      </div>

      {obligations.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No obligations extracted yet.</p>
          <p className="text-sm mt-1">Upload a contract to automatically detect obligations, or this contract may not have any.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {obligations.map((ob: any, idx: number) => {
            const config = TYPE_CONFIG[ob.type] || { icon: <Clock className="w-4 h-4 text-muted-foreground" />, color: 'bg-secondary text-foreground' }
            return (
              <Card key={ob.id || idx} className="p-4 flex items-start gap-4 bg-card/50 hover:bg-card transition-colors">
                <div className="p-2 bg-secondary rounded-lg shrink-0">
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className={`text-xs ${config.color}`}>
                      {ob.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Responsible: {ob.party}</span>
                    {ob.status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        ob.status === 'active' ? 'bg-green-500/10 text-green-600' :
                        ob.status === 'overdue' ? 'bg-red-500/10 text-red-600' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {ob.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground font-medium">{ob.description}</p>
                </div>
                {ob.dueDate && (
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md">
                      <Calendar className="w-3.5 h-3.5" />
                      {ob.dueDate}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
