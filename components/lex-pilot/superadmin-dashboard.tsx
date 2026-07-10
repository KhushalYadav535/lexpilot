'use client'

import React, { useState, useEffect } from 'react'
import { fetchAPI } from '@/lib/api'
import { Loader2, Globe, Building2, Users, Power, PowerOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      const data = await fetchAPI('/superadmin/tenants')
      setTenants(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
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

      </div>
    </div>
  )
}
