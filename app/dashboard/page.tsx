'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/lex-pilot/sidebar'
import { DocumentViewer } from '@/components/lex-pilot/document-viewer'
import { InsightsPanel } from '@/components/lex-pilot/insights-panel'
import { ChatPanel } from '@/components/lex-pilot/chat-panel'
import { ExecutiveSummary } from '@/components/lex-pilot/executive-summary'
import { ObligationsList } from '@/components/lex-pilot/obligations-list'
import { ComparisonViewer } from '@/components/lex-pilot/comparison-viewer'
import { LiveRedline } from '@/components/lex-pilot/live-redline'
import { CompliancePanel } from '@/components/lex-pilot/compliance-panel'
import { VersionComparison } from '@/components/lex-pilot/version-comparison'
import { TranslationPanel } from '@/components/lex-pilot/translation-panel'
import { SuperAdminDashboard } from '@/components/lex-pilot/superadmin-dashboard'
import { AdminPanel } from '@/components/lex-pilot/admin-panel'
import { MultiDocReview } from '@/components/lex-pilot/multi-doc-review'
import { DashboardCharts } from '@/components/lex-pilot/dashboard-charts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { AgentLoader } from '@/components/lex-pilot/agent-loader'
import { PlaybookMemory } from '@/components/lex-pilot/playbook-memory'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, LogOut, FileText, Search, LayoutGrid, AlignLeft, Calendar, Wand2, BookOpen, GitCompare, ShieldCheck, Languages, Users, ArrowLeft, ArrowUpRight, Settings, Scale, FileSearch, Brain } from 'lucide-react'
import Link from 'next/link'
import { fetchAPI, removeAuthToken } from '@/lib/api'
import type { Contract } from '@/lib/constants'

export default function DashboardPage() {
  const router = useRouter()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadText, setUploadText] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploadMode, setUploadMode] = useState('local') // local, url, email
  const [importUrl, setImportUrl] = useState('')
  const [emailCreds, setEmailCreds] = useState({ email: '', password: '' })
  const [activeTab, setActiveTab] = useState('document')
  const [dashboardNav, setDashboardNav] = useState('dashboard') // dashboard, contracts, deadlines, team

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    }
    loadContracts()
  }, [])

  const loadContracts = async () => {
    try {
      const data = await fetchAPI('/contracts')
      setContracts(data || [])
    } catch (error) {
      console.error('Failed to load contracts', error)
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (!userStr || JSON.parse(userStr).role !== 'superadmin') {
         router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async () => {
    setIsUploading(true)
    try {
      let newContract;
      
      if (uploadMode === 'url') {
        if (!importUrl.trim()) throw new Error('URL is required')
        newContract = await fetchAPI('/contracts/import-url', {
          method: 'POST',
          body: JSON.stringify({ url: importUrl, title: uploadTitle }),
        })
      } else if (uploadMode === 'email') {
        if (!emailCreds.email || !emailCreds.password) throw new Error('Email credentials required')
        newContract = await fetchAPI('/contracts/import-email', {
          method: 'POST',
          body: JSON.stringify({ email: emailCreds.email, password: emailCreds.password, title: uploadTitle }),
        })
      } else {
        if (!uploadText.trim() && !uploadFile) throw new Error('File or text is required')
        let body: any;
        if (uploadFile) {
          const formData = new FormData();
          formData.append('title', uploadTitle || uploadFile.name);
          formData.append('file', uploadFile);
          if (uploadText) formData.append('textContent', uploadText);
          body = formData;
        } else {
          body = JSON.stringify({ title: uploadTitle, textContent: uploadText });
        }
        newContract = await fetchAPI('/contracts/analyze', {
          method: 'POST',
          body,
        })
      }

      setContracts([newContract, ...contracts])
      setSelectedContractId(newContract._id)
      setIsDialogOpen(false)
      // Reset state
      setUploadTitle('')
      setUploadText('')
      setUploadFile(null)
      setImportUrl('')
      setEmailCreds({ email: '', password: '' })
    } catch (error: any) {
      console.error('Failed to upload', error)
      alert(error.message || 'Failed to analyze contract. Ensure backend is running and credentials/files are correct.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    if (typeof window !== 'undefined') localStorage.removeItem('user')
    router.push('/login')
  }

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  if (currentUser?.role === 'superadmin') {
    return (
      <div className="h-screen flex flex-col">
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
          <div className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
            LexPilot <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full uppercase tracking-wider">Super Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </header>
        <div className="flex-1 overflow-hidden">
          <SuperAdminDashboard />
        </div>
      </div>
    )
  }

  const selectedContract = contracts.find((c: any) => (c._id || c.id) === selectedContractId)
  
  // Reset tab to document view when switching contracts
  const handleSelectContract = (id: string) => {
    setSelectedContractId(id)
    setActiveTab('document')
  }

  const filteredContracts = contracts.filter((c: any) => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.counterparty?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col min-w-0 bg-background text-foreground overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/30">
              <span className="text-primary-foreground font-serif font-bold text-sm">L</span>
            </div>
            <span className="font-serif font-bold text-base tracking-tight hidden sm:block">LexPilot</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/40 border-transparent hover:border-border h-9 text-sm focus-visible:ring-1 transition-all rounded-full w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger render={<Button size="sm" className="gap-2 button-premium rounded-full px-4" />}>
                <Plus className="w-4 h-4" /> New Contract
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border/50 shadow-2xl glass">
                <div className="p-6 bg-gradient-to-b from-primary/10 to-transparent border-b border-border/50">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif font-bold">Import Contract</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground mt-2">
                    Import via file upload, web link, or directly from your email inbox.
                  </p>
                </div>
                
                <Tabs defaultValue="local" onValueChange={(v) => setUploadMode(v)} className="w-full max-h-[75vh] overflow-y-auto">
                  {isUploading ? (
                    <div className="py-12">
                      <AgentLoader />
                    </div>
                  ) : (
                    <>
                      <div className="px-6 pt-4">
                        <TabsList className="w-full grid grid-cols-3">
                          <TabsTrigger value="local">Local File</TabsTrigger>
                          <TabsTrigger value="url">Web Link</TabsTrigger>
                          <TabsTrigger value="email">Email</TabsTrigger>
                        </TabsList>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Contract Title</label>
                          <Input 
                            placeholder="e.g., Acme Corp Enterprise Agreement" 
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            className="h-12 bg-background/50"
                          />
                        </div>

                        <TabsContent value="local" className="space-y-6 mt-0">
                          <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-xl bg-background/50 hover:bg-primary/5 transition-colors">
                              <Plus className="w-10 h-10 text-primary mb-3 opacity-80" />
                              <p className="text-sm font-medium mb-1">Click to browse or drag file here</p>
                              <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX, TXT, PNG, JPG (OCR)</p>
                              <Input 
                                type="file" 
                                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              {uploadFile && (
                                <div className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  {uploadFile.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-px bg-border flex-1"></div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">OR PASTE TEXT</span>
                            <div className="h-px bg-border flex-1"></div>
                          </div>
                          <Textarea 
                            placeholder="Paste your contract clauses here..." 
                            className="min-h-[120px] bg-background/50 resize-none"
                            value={uploadText}
                            onChange={(e) => setUploadText(e.target.value)}
                          />
                        </TabsContent>

                        <TabsContent value="url" className="space-y-4 mt-0">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Public File URL</label>
                            <Input 
                              placeholder="https://example.com/contract.pdf or Google Drive Link" 
                              value={importUrl}
                              onChange={(e) => setImportUrl(e.target.value)}
                              className="h-12 bg-background/50"
                            />
                            <p className="text-xs text-muted-foreground">URL must point directly to a supported file type.</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="email" className="space-y-4 mt-0">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Email Address</label>
                            <Input 
                              placeholder="you@gmail.com" 
                              type="email"
                              value={emailCreds.email}
                              onChange={(e) => setEmailCreds({...emailCreds, email: e.target.value})}
                              className="h-12 bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">App Password (IMAP)</label>
                            <Input 
                              placeholder="16-character App Password" 
                              type="password"
                              value={emailCreds.password}
                              onChange={(e) => setEmailCreds({...emailCreds, password: e.target.value})}
                              className="h-12 bg-background/50"
                            />
                            <p className="text-xs text-muted-foreground">We will fetch the latest unread email with an attachment from your INBOX.</p>
                          </div>
                        </TabsContent>

                        <Button 
                          className="w-full h-12 text-base font-semibold button-premium shadow-lg mt-4" 
                          onClick={handleUpload}
                          disabled={(uploadMode === 'local' && !uploadText.trim() && !uploadFile) || (uploadMode === 'url' && !importUrl.trim()) || (uploadMode === 'email' && (!emailCreds.email || !emailCreds.password))}
                        >
                          Import & Analyze
                        </Button>
                      </div>
                    </>
                  )}
                </Tabs>
              </DialogContent>
            </Dialog>

            {contracts.length >= 2 && (
              <MultiDocReview allContracts={contracts} />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center h-9 px-2 hover:bg-secondary/80 rounded-md transition-colors cursor-pointer outline-none border-0 bg-transparent">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline-block ml-2 text-sm font-medium">{currentUser?.name?.split(' ')[0] || 'User'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{currentUser?.email || 'user@example.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Global Sidebar (Collapsible) */}
          <TooltipProvider delayDuration={0}>
            <div className={`border-r border-border bg-sidebar flex flex-col hidden md:flex shrink-0 transition-all duration-300 ${!selectedContract ? 'w-64' : 'w-16 items-center'}`}>
              <div className={`p-4 flex items-center border-b border-border ${!selectedContract ? 'gap-3' : 'justify-center w-full'}`}>
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                {!selectedContract && <span className="font-serif font-bold text-lg truncate">LexPilot</span>}
              </div>

              <div className={`flex-1 flex flex-col gap-2 ${!selectedContract ? 'p-4' : 'py-4 px-2 items-center w-full'}`}>
                {!selectedContract && <div className="text-xs font-semibold text-muted-foreground mb-3 px-2 uppercase tracking-wider">Workspace</div>}
                
                {/* Reusable inline button block logic */}
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, onClick: () => { setDashboardNav('dashboard'); setSelectedContractId(null) } },
                  { id: 'contracts', label: 'All Contracts', icon: FileSearch, onClick: () => { setDashboardNav('contracts'); setSelectedContractId(null) } },
                  { id: 'compare', label: 'Compare', icon: GitCompare, onClick: () => router.push('/dashboard/compare') },
                  { id: 'playbooks', label: 'Playbooks', icon: BookOpen, onClick: () => router.push('/dashboard/playbooks') },
                  { id: 'learning', label: 'AI Memory', icon: Brain, onClick: () => { setDashboardNav('learning'); setSelectedContractId(null) } },
                  { id: 'team', label: 'Team Workspace', icon: Users, onClick: () => { setDashboardNav('team'); setSelectedContractId(null) } },
                ].map(item => {
                  const isActive = dashboardNav === item.id && !selectedContract
                  const isCollapsed = !!selectedContract
                  const Icon = item.icon
                  const btn = (
                    <Button 
                      key={item.id}
                      onClick={item.onClick}
                      variant={isActive ? 'secondary' : 'ghost'} 
                      className={`font-medium ${isCollapsed ? 'w-10 h-10 p-0 flex justify-center items-center rounded-xl' : 'w-full justify-start'} ${isActive ? 'text-primary shadow-sm bg-primary/10 hover:bg-primary/20' : 'text-muted-foreground'}`}
                    >
                      <Icon className={isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} />
                      {!isCollapsed && item.label}
                    </Button>
                  )
                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>{btn}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    )
                  }
                  return btn
                })}

                {!selectedContract && <div className="text-xs font-semibold text-muted-foreground mb-3 mt-8 px-2 uppercase tracking-wider">Settings</div>}
                {!!selectedContract && <div className="mt-auto" />}
                
                {(() => {
                  const isActive = false
                  const isCollapsed = !!selectedContract
                  const btn = (
                    <Button 
                      onClick={() => router.push('/dashboard/admin')}
                      variant="ghost" 
                      className={`font-medium text-muted-foreground ${isCollapsed ? 'w-10 h-10 p-0 flex justify-center items-center rounded-xl mt-auto' : 'w-full justify-start mt-auto'}`}
                    >
                      <Settings className={isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} />
                      {!isCollapsed && 'Administration'}
                    </Button>
                  )
                  if (isCollapsed) {
                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>{btn}</TooltipTrigger>
                        <TooltipContent side="right">Administration</TooltipContent>
                      </Tooltip>
                    )
                  }
                  return btn
                })()}
              </div>
            </div>
          </TooltipProvider>

          {!selectedContract ? (
            <div className="flex-1 flex overflow-hidden bg-secondary/5">

              {/* Main Dashboard Area */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                  {dashboardNav === 'learning' && (
                    <div className="h-[80vh] border rounded-2xl bg-card overflow-hidden">
                      <PlaybookMemory />
                    </div>
                  )}

                  {dashboardNav === 'dashboard' && (
                    <>
                      <div className="flex items-end justify-between">
                        <div>
                          <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}</h1>
                          <p className="text-muted-foreground mt-2">Here is what&apos;s happening with your contracts today.</p>
                        </div>
                      </div>

                      {/* KPIs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                          <h3 className="text-sm font-medium text-muted-foreground">Active Contracts</h3>
                          <p className="text-3xl font-bold mt-2">{contracts.length}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                          <h3 className="text-sm font-medium text-muted-foreground">Pending Review</h3>
                          <p className="text-3xl font-bold mt-2 text-amber-500">{contracts.filter((c: any) => c.status === 'review').length || 0}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                          <h3 className="text-sm font-medium text-muted-foreground">High Risk</h3>
                          <p className="text-3xl font-bold mt-2 text-red-500">{contracts.filter((c: any) => (c.analysis?.riskScore || 0) > 70).length || 0}</p>
                        </div>
                      </div>

                      {/* Charts & Graphs */}
                      <DashboardCharts contracts={contracts} />
                    </>
                  )}

                  {(dashboardNav === 'dashboard' || dashboardNav === 'contracts') && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">{dashboardNav === 'dashboard' ? 'Recent Contracts' : 'All Contracts'}</h2>
                        {dashboardNav === 'contracts' && (
                          <div className="relative w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                              placeholder="Search contracts..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 h-9"
                            />
                          </div>
                        )}
                      </div>
                      {contracts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-card border border-dashed rounded-2xl">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-primary opacity-70" />
                          </div>
                          <h3 className="text-lg font-bold mb-2">No contracts yet</h3>
                          <p className="text-muted-foreground text-center max-w-sm mb-6">
                            Import your first contract to get AI-powered insights, risk analysis, and smart redlining.
                          </p>
                          <Button onClick={() => setIsDialogOpen(true)} className="button-premium rounded-full px-8">
                            <Plus className="w-4 h-4 mr-2" /> Import Contract
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {filteredContracts.map((contract: any) => {
                            const id = contract._id || contract.id
                            const riskScore = contract.analysis?.riskScore || 0
                            return (
                              <div 
                                key={id}
                                onClick={() => handleSelectContract(id)}
                                className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md cursor-pointer transition-all relative overflow-hidden flex flex-col"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                </div>
                                <h3 className="font-semibold text-base line-clamp-1 mb-1" title={contract.title}>{contract.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-1" title={contract.counterparty}>{contract.counterparty || 'Unknown Party'}</p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    riskScore > 70 ? 'bg-red-500/10 text-red-500' : 
                                    riskScore > 40 ? 'bg-amber-500/10 text-amber-500' : 
                                    'bg-green-500/10 text-green-500'
                                  }`}>
                                    Risk: {riskScore}
                                  </span>
                                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full capitalize">
                                    {contract.status || 'review'}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {dashboardNav === 'deadlines' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Upcoming Deadlines & Obligations</h2>
                      </div>
                      <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground mb-1">Calendar Integration</h3>
                        <p className="max-w-md mx-auto">This view will automatically extract and sync all critical dates, renewals, and obligations from your active contracts.</p>
                      </div>
                    </div>
                  )}

                  {dashboardNav === 'team' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Team Workspace</h2>
                      </div>
                      <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground mb-1">Collaborate Securely</h3>
                        <p className="max-w-md mx-auto">Invite legal, sales, and external counsel to securely review and negotiate contracts in real-time.</p>
                        <Button variant="outline" className="mt-4"><Plus className="w-4 h-4 mr-2" /> Invite Member</Button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
               REVIEW MODE (Contract Selected - 2 Pane Layout)
               ======================================================== */
            <div className="flex-1 flex overflow-hidden bg-background">
              {/* Left Pane: Document & Views */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Review Header with Back Button */}
                <div className="h-14 border-b border-border flex items-center px-4 gap-4 bg-sidebar/30 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedContractId(null)} className="text-muted-foreground hover:text-foreground shrink-0 rounded-full px-3">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                  </Button>
                  <div className="h-4 w-px bg-border"></div>
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <h2 className="font-serif font-bold text-sm truncate">{selectedContract.title}</h2>
                  </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                  <div className="border-b border-border px-4 bg-sidebar/10 shrink-0 overflow-x-auto no-scrollbar">
                    <TabsList className="h-12 bg-transparent border-none w-max justify-start p-0 space-x-6">
                      {([
                        { value: 'document',    label: 'Clauses' },
                        { value: 'summary',     label: 'Summary' },
                        { value: 'obligations', label: 'Tasks' },
                        { value: 'redlines',    label: 'Redline',     alwaysShow: false },
                        { value: 'compare',     label: 'Playbook',    alwaysShow: false },
                        { value: 'versions',    label: 'Versions',    alwaysShow: false },
                        { value: 'compliance',  label: 'Comply',      alwaysShow: false },
                        { value: 'translate',   label: 'Translate' },
                      ] as any).filter((t: any) => t.alwaysShow !== false || currentUser?.role !== 'sales').map((tab: any) => (
                        <TabsTrigger 
                          key={tab.value} 
                          value={tab.value}
                          className="px-1 py-3 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary font-medium text-sm text-muted-foreground hover:text-foreground transition-none bg-transparent"
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  <div className="flex-1 overflow-hidden relative bg-background">
                    <TabsContent value="document" className="h-full m-0 p-0 absolute inset-0">
                      <DocumentViewer contract={selectedContract} />
                    </TabsContent>
                    <TabsContent value="summary" className="h-full m-0 p-0 absolute inset-0">
                      <ExecutiveSummary contract={selectedContract} />
                    </TabsContent>
                    <TabsContent value="obligations" className="h-full m-0 p-0 absolute inset-0">
                      <ObligationsList contract={selectedContract} />
                    </TabsContent>
                    {currentUser?.role !== 'sales' && (
                      <>
                        <TabsContent value="redlines" className="h-full m-0 p-6 absolute inset-0 overflow-y-auto">
                          <div className="max-w-3xl mx-auto space-y-6">
                            <div>
                              <h2 className="text-2xl font-serif font-bold tracking-tight">AI Redline Suggestions</h2>
                              <p className="text-muted-foreground mt-1">Review and accept AI-generated wording changes.</p>
                            </div>
                            <LiveRedline contract={selectedContract} />
                          </div>
                        </TabsContent>
                        <TabsContent value="compare" className="h-full m-0 p-6 absolute inset-0 overflow-y-auto">
                          <div className="max-w-4xl mx-auto space-y-6">
                            <div>
                              <h2 className="text-2xl font-serif font-bold tracking-tight">AI Playbook Comparison</h2>
                              <p className="text-muted-foreground mt-1">Compare this contract against company standard playbooks.</p>
                            </div>
                            <ComparisonViewer contract={selectedContract} />
                          </div>
                        </TabsContent>
                        <TabsContent value="versions" className="h-full m-0 p-6 absolute inset-0 overflow-y-auto">
                          <div className="max-w-4xl mx-auto space-y-6">
                            <div>
                              <h2 className="text-2xl font-serif font-bold tracking-tight">Version Comparison</h2>
                              <p className="text-muted-foreground mt-1">Compare this contract against another in your library.</p>
                            </div>
                            <VersionComparison contract={selectedContract} allContracts={contracts} />
                          </div>
                        </TabsContent>
                        <TabsContent value="compliance" className="h-full m-0 p-0 absolute inset-0">
                          <CompliancePanel contract={selectedContract} />
                        </TabsContent>
                      </>
                    )}
                    <TabsContent value="translate" className="h-full m-0 p-0 absolute inset-0">
                      <TranslationPanel contract={selectedContract} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Right Pane: AI Copilot (Analysis + Chat) */}
              <div className="w-[320px] md:w-[350px] flex flex-col border-l border-border overflow-hidden shrink-0 bg-sidebar/30 h-full shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                <Tabs defaultValue="analysis" className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-4 py-2 border-b border-border bg-background shrink-0">
                    <TabsList className="w-full grid grid-cols-2 bg-secondary/50 rounded-lg p-1">
                      <TabsTrigger value="analysis" className="rounded-md">Analysis</TabsTrigger>
                      <TabsTrigger value="chat" className="rounded-md flex items-center gap-2">
                        <Wand2 className="w-3.5 h-3.5" /> AI Chat
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="flex-1 overflow-hidden relative bg-background">
                    <TabsContent value="analysis" className="h-full m-0 p-0 absolute inset-0">
                      <InsightsPanel
                        contract={selectedContract}
                        userRole={currentUser?.role}
                        onContractUpdate={(updated) => {
                          setContracts(prev => prev.map(c => ((c as any)._id || c.id) === ((updated as any)._id || updated.id) ? updated : c))
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="chat" className="h-full m-0 p-0 absolute inset-0">
                      <ChatPanel contractId={(selectedContract as any)._id || selectedContract.id} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}
