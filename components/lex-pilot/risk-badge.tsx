import React from 'react'
import { Badge } from '@/components/ui/badge'

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'

interface RiskBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md' | 'lg'
}

const riskConfig: Record<RiskLevel, { label: string; className: string; dotColor: string }> = {
  critical: {
    label: 'Critical',
    className: 'bg-lex-risk-critical/15 text-lex-risk-critical hover:bg-lex-risk-critical/25 border-lex-risk-critical/30',
    dotColor: 'bg-lex-risk-critical',
  },
  high: {
    label: 'High',
    className: 'bg-lex-risk-high/15 text-lex-risk-high hover:bg-lex-risk-high/25 border-lex-risk-high/30',
    dotColor: 'bg-lex-risk-high',
  },
  medium: {
    label: 'Medium',
    className: 'bg-lex-risk-medium/15 text-lex-risk-medium hover:bg-lex-risk-medium/25 border-lex-risk-medium/30',
    dotColor: 'bg-lex-risk-medium',
  },
  low: {
    label: 'Low',
    className: 'bg-lex-risk-low/15 text-lex-risk-low hover:bg-lex-risk-low/25 border-lex-risk-low/30',
    dotColor: 'bg-lex-risk-low',
  },
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const config = riskConfig[level]
  const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'

  return (
    <Badge variant="outline" className={`${config.className} ${sizeClass} font-medium`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${config.dotColor}`} />
      {config.label}
    </Badge>
  )
}
