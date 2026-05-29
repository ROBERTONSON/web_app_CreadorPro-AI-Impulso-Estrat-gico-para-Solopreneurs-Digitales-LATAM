'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StrategyReport } from '@/lib/types'

interface Section {
  id: keyof StrategyReport
  title: string
  icon: LucideIcon
}

interface SidebarProps {
  sections: Section[]
  activeSection: string
  onSectionChange: (id: string) => void
}

export default function Sidebar({ sections, activeSection, onSectionChange }: SidebarProps) {
  const scrollTo = (id: string) => {
    onSectionChange(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex-shrink-0 hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="p-4 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tu Plan Estratégico</p>
      </div>
      <nav className="p-2 flex-1">
        {sections.map(({ id, title, icon: Icon }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors mb-0.5',
              activeSection === id
                ? 'bg-violet-950/50 text-violet-300 font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{title}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
