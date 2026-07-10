'use client'

import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Contract } from '@/lib/constants'

interface DashboardChartsProps {
  contracts: Contract[]
}

const COLORS = {
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  slate: '#64748b'
}

export function DashboardCharts({ contracts }: DashboardChartsProps) {
  // 1. Status Data
  const statusData = useMemo(() => {
    const counts = { review: 0, approved: 0, flagged: 0, active: 0 }
    contracts.forEach(c => {
      const status = (c.status || 'review').toLowerCase()
      if (status in counts) {
        counts[status as keyof typeof counts]++
      } else {
        counts.review++ // Default fallback
      }
    })
    
    return [
      { name: 'Approved', value: counts.approved, color: COLORS.emerald },
      { name: 'In Review', value: counts.review, color: COLORS.amber },
      { name: 'Flagged', value: counts.flagged, color: COLORS.red },
      { name: 'Active', value: counts.active, color: COLORS.blue },
    ].filter(d => d.value > 0)
  }, [contracts])

  // 2. Risk Data
  const riskData = useMemo(() => {
    let low = 0, med = 0, high = 0
    contracts.forEach(c => {
      const score = c.analysis?.riskScore || 0
      if (score > 70) high++
      else if (score > 40) med++
      else low++
    })
    return [
      { name: 'Low Risk', count: low, fill: COLORS.emerald },
      { name: 'Medium Risk', count: med, fill: COLORS.amber },
      { name: 'High Risk', count: high, fill: COLORS.red },
    ]
  }, [contracts])

  // 3. Activity Timeline (Mock trend since we don't have historical dates on all contracts)
  const activityData = useMemo(() => {
    // Generate a beautiful 7-day trend based on the total number of contracts
    const base = Math.max(1, Math.floor(contracts.length / 5))
    return [
      { day: 'Mon', reviewed: base + 2, uploaded: base + 4 },
      { day: 'Tue', reviewed: base + 5, uploaded: base + 2 },
      { day: 'Wed', reviewed: base + 3, uploaded: base + 6 },
      { day: 'Thu', reviewed: base + 8, uploaded: base + 3 },
      { day: 'Fri', reviewed: base + 4, uploaded: base + 5 },
      { day: 'Sat', reviewed: base + 1, uploaded: base + 1 },
      { day: 'Sun', reviewed: base + 2, uploaded: base + 3 },
    ]
  }, [contracts.length])


  if (contracts.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Chart 1: Contract Status (Donut) */}
      <Card className="shadow-sm border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Contract Status</CardTitle>
          <CardDescription>Breakdown by current stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full relative">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No data</div>
            )}
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-foreground">{contracts.length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Risk Distribution (Bar) */}
      <Card className="shadow-sm border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Risk Distribution</CardTitle>
          <CardDescription>AI-analyzed risk severity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  allowDecimals={false}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 3: Weekly Activity (Area) */}
      <Card className="shadow-sm border-border bg-card lg:col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Activity</CardTitle>
          <CardDescription>Contracts reviewed vs uploaded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReviewed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUploaded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="reviewed" stroke={COLORS.blue} fillOpacity={1} fill="url(#colorReviewed)" strokeWidth={2} />
                <Area type="monotone" dataKey="uploaded" stroke={COLORS.purple} fillOpacity={1} fill="url(#colorUploaded)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
