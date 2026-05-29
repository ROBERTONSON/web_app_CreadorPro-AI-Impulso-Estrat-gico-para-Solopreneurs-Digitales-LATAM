'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  title: string
  icon: LucideIcon
  group: string
}

interface SidebarProps {
  sections: Section[]
  activeSection: string
  onSectionChange: (id: string) => void
}

const GROUP_LABELS: Record<string, string> = {
  summary: 'Resumen',
  strategy: 'Estrategia',
  content: 'Contenido',
  business: 'Negocio',
  analysis: 'Análisis',
}

export default function Sidebar({ sections, activeSection, onSectionChange }: SidebarProps) {
  const scrollTo = (id: string) => {
    onSectionChange(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Group sections
  const groups = sections.reduce<Record<string, Section[]>>((acc, s) => {
    if (!acc[s.group]) acc[s.group] = []
    acc[s.group].push(s)
    return acc
  }, {})

  return (
    <aside className="w-56 border-r border-border bg-card flex-shrink-0 hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">CP</span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tu Plan</p>
        </div>
      </div>
      <nav className="p-2 flex-1">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="mb-3">
            <p className="px-3 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
              {GROUP_LABELS[group] ?? group}
            </p>
            {items.map(({ id, title, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  'w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors mb-0.5',
                  activeSection === id
                    ? 'bg-violet-950/50 text-violet-300 font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{title}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
