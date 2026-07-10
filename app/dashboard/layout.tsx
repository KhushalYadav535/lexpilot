'use client'

import React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/lex-pilot/theme-toggle'
import { 
  FileSearch, 
  GitCompare, 
  BookOpen, 
  Settings, 
  Scale
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

function NavItem({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link 
          href={href} 
          className={`w-full flex justify-center p-3 rounded-lg transition-all duration-200 ${
            isActive 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          {icon}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
