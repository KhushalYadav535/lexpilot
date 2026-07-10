'use client'

import React, { useEffect, useState } from 'react'
import { Plus, BookOpen, Settings2, FileText, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchAPI } from '@/lib/api'

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPlaybooks() {
      try {
        const data = await fetchAPI('/playbooks')
        setPlaybooks(data || [])
      } catch (error) {
        console.error('Failed to load playbooks', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPlaybooks()
  }, [])

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <header className="h-20 border-b border-border bg-secondary/10 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            Company Playbooks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage legal guidelines, acceptable fallbacks, and standard clauses.
          </p>
        </div>
        
        <Button className="button-premium shadow-lg gap-2 rounded-full px-6">
          <Plus className="w-4 h-4" />
          Create Playbook
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p>Loading playbooks...</p>
            </div>
          ) : playbooks.length === 0 ? (
            <div className="mt-12 p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center bg-secondary/5">
              <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center shadow-sm mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No Playbooks Found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Upload your existing PDF or DOCX legal guidelines and LexPilot will automatically convert them into AI Playbook rules.
              </p>
              <Button variant="outline" className="mt-6 rounded-full px-8 gap-2">
                <Plus className="w-4 h-4" />
                Create First Playbook
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playbooks.map((pb) => (
                  <div 
                    key={pb._id || pb.id} 
                    className="group relative bg-background border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:border-primary/50 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground">
                          <Settings2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                        {pb.title}
                      </h3>
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                        {pb.textContent ? 'Custom Rules' : 'Standard'}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">Active</strong>
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          {new Date(pb.createdAt).toLocaleDateString()}
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
