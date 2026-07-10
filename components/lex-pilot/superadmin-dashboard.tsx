'use client'

import React, { useState, useEffect } from 'react'
import { fetchAPI } from '@/lib/api'
import { Loader2, Globe, Building2, Users, Power, PowerOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<any[]>([])
  const [billing, setBilling] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([loadTenants(), loadBilling()]).finally(() => setIsLoading(false))
  }, [])

  const loadTenants = async () => {
    try {
      const data = await fetchAPI('/superadmin/tenants')
      setTenants(data)
    } catch (error) {
      console.error(error)
    }
  }

  const loadBilling = async () => {
    try {
      const data = await fetchAPI('/superadmin/billing')
      setBilling(data)
    } catch (error) {
      console.error(error)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetchAPI(`/superadmin/tenants/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !currentStatus })
      })
      loadTenants()
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  const totalUsers = tenants.reduce((acc, t) => acc + t.userCount, 0)

  return (
    <div className="h-full flex flex-col bg-background p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold">Super Admin Portal</h1>
            <p className="text-muted-foreground mt-1">Global view of all companies and system health.</p>
          </div>
        </div>

        <Tabs defaultValue="tenants" className="w-full">
          <TabsList className="mb-6 grid w-[400px] grid-cols-2">
            <TabsTrigger value="tenants">Companies (Tenants)</TabsTrigger>
            <TabsTrigger value="billing">Billing & Subscriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tenants" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 flex items-center gap-4 glass">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Building2 className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tenants</p>
                  <p className="text-3xl font-bold">{tenants.length}</p>
                </div>
              </Card>
              <Card className="p-6 flex items-center gap-4 glass">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><Users className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                </div>
              </Card>
            </div>

            <Card className="border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Company (Tenant)</th>
                      <th className="px-6 py-4 font-medium">Created On</th>
                      <th className="px-6 py-4 font-medium">Users</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tenants.map(t => (
                      <tr key={t._id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-medium">{t.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{t.userCount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${t.isActive ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                            {t.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant={t.isActive ? 'destructive' : 'default'}
                            size="sm"
                            className="gap-2"
                            onClick={() => toggleStatus(t._id, t.isActive)}
                          >
                            {t.isActive ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                            {t.isActive ? 'Disable' : 'Enable'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {tenants.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No tenants registered yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            {billing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 flex items-center gap-4 glass">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Platform MRR (Stripe)</p>
                      <p className="text-3xl font-bold">${(billing.mrr).toLocaleString()}</p>
                    </div>
                  </Card>
                  <Card className="p-6 flex items-center gap-4 glass">
                    <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Paid Seats</p>
                      <p className="text-3xl font-bold">{billing.seatsUsed} / {billing.seatsTotal}</p>
                    </div>
                  </Card>
                </div>
                <Card className="border border-border rounded-xl overflow-hidden shadow-sm p-6 glass">
                  <h3 className="text-lg font-bold mb-4">Recent Platform Invoices (Stripe)</h3>
                  <div className="space-y-4">
                    {billing.recentInvoices.map((inv: any) => (
                      <div key={inv.id} className="flex justify-between items-center p-4 border rounded-lg bg-background/50">
                        <div>
                          <p className="font-medium text-foreground">{inv.id}</p>
                          <p className="text-sm text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${inv.amount.toLocaleString()}</p>
                          <p className="text-xs text-green-500 font-medium uppercase">{inv.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <p className="text-muted-foreground">Could not connect to Stripe API.</p>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
