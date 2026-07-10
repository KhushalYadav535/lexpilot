'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/lex-pilot/theme-toggle'
import { Sidebar } from '@/components/lex-pilot/sidebar'
import { DocumentViewer } from '@/components/lex-pilot/document-viewer'
import { InsightsPanel } from '@/components/lex-pilot/insights-panel'
import { ChatPanel } from '@/components/lex-pilot/chat-panel'
import { SAMPLE_CONTRACTS } from '@/lib/constants'
import { ChevronLeft } from 'lucide-react'

export default function DashboardPage() {
  const [selectedContractId, setSelectedContractId] = useState(SAMPLE_CONTRACTS[0].id)
  const selectedContract = SAMPLE_CONTRACTS.find((c) => c.id === selectedContractId) || SAMPLE_CONTRACTS[0]

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <header className="h-16 border-b border-border bg-secondary/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="font-serif font-bold text-xl text-foreground">LexPilot Dashboard</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Contracts List */}
        <div className="w-80 border-r border-border">
          <Sidebar contracts={SAMPLE_CONTRACTS} selectedId={selectedContractId} onSelect={setSelectedContractId} />
        </div>

        {/* Center - Document Viewer */}
        <div className="flex-1 border-r border-border overflow-hidden">
          <DocumentViewer contract={selectedContract} />
        </div>

        {/* Right Column - Split between Insights and Chat */}
        <div className="w-80 flex flex-col border-l border-border overflow-hidden">
          {/* Insights Panel */}
          <div className="flex-1 border-b border-border overflow-hidden">
            <InsightsPanel contract={selectedContract} />
          </div>

          {/* Chat Panel */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
