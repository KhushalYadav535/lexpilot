'use client'

import React from 'react'
import { AdminPanel } from '@/components/lex-pilot/admin-panel'

export default function AdminPage() {
  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0 z-10">
        <div>
          <h1 className="font-serif font-bold text-lg text-foreground">Enterprise Administration</h1>
          <p className="text-xs text-muted-foreground">Manage workflows, compliance checks, roles, and integrations.</p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <AdminPanel />
      </div>
    </div>
  )
}
