'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldCheck, GitMerge, FileText, Users, Plus, Loader2, Trash2 } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

export function AdminPanel() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  
  // Rule State
  const [newRuleName, setNewRuleName] = useState('')
  const [newRuleCondition, setNewRuleCondition] = useState('Risk Score > 75')
  const [newRuleAction, setNewRuleAction] = useState('Route to General Counsel')

  // User State
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserRole, setNewUserRole] = useState('sales')

  useEffect(() => {
    loadWorkflows()
    loadUsers()
  }, [])

  const loadWorkflows = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAPI('/admin/workflows')
      setWorkflows(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const data = await fetchAPI('/admin/users')
      setUsers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleAddRule = async () => {
    if (!newRuleName) return
    try {
      const conditionParts = newRuleCondition.split(' ') // basic parse for UI demo
      const rule = await fetchAPI('/admin/workflows', {
        method: 'POST',
        body: JSON.stringify({
          name: newRuleName,
          condition: {
            field: conditionParts[0] || 'riskScore',
            operator: conditionParts[1] || '>',
            value: conditionParts[2] || '70'
          },
          action: { routeTo: newRuleAction }
        })
      })
      setWorkflows([...workflows, rule])
      setNewRuleName('')
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) return
    try {
      const newUser = await fetchAPI('/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole
        })
      })
      setUsers([...users, newUser])
      setNewUserName('')
      setNewUserEmail('')
      setNewUserPassword('')
    } catch (error: any) {
      alert(error.message || 'Error creating user')
      console.error(error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await fetchAPI(`/admin/users/${id}`, { method: 'DELETE' })
      setUsers(users.filter(u => u._id !== id))
    } catch (error: any) {
      alert(error.message || 'Error deleting user')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Platform Administration</h2>
        <p className="text-muted-foreground mt-2">Manage team access, AI routing rules, and playbooks.</p>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="team" className="gap-2"><Users className="w-4 h-4" /> Team</TabsTrigger>
          <TabsTrigger value="workflows" className="gap-2"><GitMerge className="w-4 h-4" /> AI Workflows</TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2"><ShieldCheck className="w-4 h-4" /> Compliance</TabsTrigger>
          <TabsTrigger value="playbooks" className="gap-2"><FileText className="w-4 h-4" /> Playbooks</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6 animate-fadeInUp">
          <Card className="p-6 glass border-primary/10 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Invite Team Member
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input placeholder="John Doe" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input placeholder="john@company.com" type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input placeholder="Temporary Password" type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <select 
                  value={newUserRole} 
                  onChange={e => setNewUserRole(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors focus:ring-1 focus:ring-primary"
                >
                  <option value="sales">Sales (Upload Only)</option>
                  <option value="legal">Legal (Review & Redline)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddUser} disabled={!newUserName || !newUserEmail || !newUserPassword} className="button-premium shadow-md w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Active Team Members</h3>
            {isLoadingUsers ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map(user => (
                  <Card key={user._id} className="p-4 flex items-start justify-between hover:border-primary/50 transition-colors shadow-sm">
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        {user.name || 'User'} 
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase">
                          {user.role}
                        </span>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 -mt-1 -mr-1" onClick={() => handleDeleteUser(user._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
                {users.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8 col-span-2">No team members found.</p>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6 animate-fadeInUp">
          <Card className="p-6 glass border-primary/10 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-primary" /> Add Routing Rule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rule Name</label>
                <Input placeholder="e.g. High Risk Escalation" value={newRuleName} onChange={e => setNewRuleName(e.target.value)} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Condition</label>
                <Input placeholder="Risk Score > 75" value={newRuleCondition} onChange={e => setNewRuleCondition(e.target.value)} className="bg-background/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Action</label>
                <Input placeholder="Route to Legal" value={newRuleAction} onChange={e => setNewRuleAction(e.target.value)} className="bg-background/50" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddRule} disabled={!newRuleName} className="button-premium shadow-md w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Add Rule
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Active Rules</h3>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /> : (
              <div className="grid gap-3">
                {workflows.map(rule => (
                  <Card key={rule._id} className="p-4 flex items-center justify-between hover:border-primary/50 transition-colors shadow-sm">
                    <div>
                      <h4 className="font-semibold text-foreground">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 bg-secondary/50 inline-block px-2 py-1 rounded-md">
                        IF <span className="text-primary font-medium">{rule.condition.field} {rule.condition.operator} {rule.condition.value}</span> THEN <span className="text-primary font-medium">{rule.action.routeTo}</span>
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
            {workflows.length === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground text-center py-8">No routing rules configured.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 animate-fadeInUp">
          <Card className="p-6 text-center">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">Global Compliance Frameworks</h3>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Manage the frameworks (GDPR, HIPAA, SOC2) that the AI should automatically check every uploaded contract against.</p>
            <Button className="mt-6" variant="outline">Configure Frameworks</Button>
          </Card>
        </TabsContent>

        <TabsContent value="playbooks" className="space-y-6 animate-fadeInUp">
           <Card className="p-6 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">Company Playbooks</h3>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Standard terms, fallback positions, and negotiation guidelines for the AI Comparison module.</p>
            <Button className="mt-6" variant="outline">Manage Playbooks</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
