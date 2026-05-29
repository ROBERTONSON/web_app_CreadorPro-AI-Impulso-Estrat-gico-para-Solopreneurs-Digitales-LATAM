'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { StrategyReport, WizardData } from '@/lib/types'
import Sidebar from '@/components/dashboard/Sidebar'
import MetricsSummary from '@/components/dashboard/MetricsSummary'
import ReportCard from '@/components/dashboard/ReportCard'
import { Button } from '@/components/ui/button'
import {
  Target, Lightbulb, Briefcase, BookOpen, PenSquare,
  Zap, Users, DollarSign, Mic, Map, Link2, Camera,
  UserCheck, Trophy, FileText, RefreshCw, Loader2
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface Section {
  id: keyof StrategyReport
  title: string
  icon: LucideIcon
}

const SECTIONS: Section[] = [
  { id: 'niches', title: 'Nichos Recomendados', icon: Target },
  { id: 'value_proposition', title: 'Propuesta de Valor', icon: Lightbulb },
  { id: 'suggested_services', title: 'Servicios Sugeridos', icon: Briefcase },
  { id: 'content_strategy', title: 'Estrategia de Contenido', icon: BookOpen },
  { id: 'post_ideas', title: 'Ideas de Publicaciones', icon: PenSquare },
  { id: 'differentiators', title: 'Diferenciadores Competitivos', icon: Zap },
  { id: 'acquisition_strategy', title: 'Estrategia de Captación', icon: Users },
  { id: 'commercial_offer', title: 'Oferta Comercial', icon: DollarSign },
  { id: 'pitch', title: 'Pitch Profesional', icon: Mic },
  { id: 'growth_roadmap', title: 'Roadmap de Crecimiento', icon: Map },
  { id: 'linkedin_strategy', title: 'Estrategia LinkedIn', icon: Link2 },
  { id: 'instagram_strategy', title: 'Estrategia Instagram', icon: Camera },
  { id: 'ideal_clients', title: 'Clientes Ideales', icon: UserCheck },
  { id: 'competitive_positioning', title: 'Posicionamiento Competitivo', icon: Trophy },
  { id: 'first_content', title: 'Primer Contenido a Publicar', icon: FileText },
]

export default function DashboardPage() {
  const router = useRouter()
  const [report, setReport] = useState<StrategyReport | null>(null)
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('niches')

  useEffect(() => {
    const stored = sessionStorage.getItem('creadorpro_report')
    const storedWizard = sessionStorage.getItem('creadorpro_wizard')
    if (!stored) {
      router.push('/wizard')
      return
    }
    setReport(JSON.parse(stored))
    if (storedWizard) setWizardData(JSON.parse(storedWizard))
  }, [router])

  const handleRegenerate = async () => {
    if (!wizardData) return
    setIsRegenerating(true)
    setShowConfirm(false)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData),
      })
      if (!res.ok) throw new Error('Error al regenerar')
      const newReport: StrategyReport = await res.json()
      sessionStorage.setItem('creadorpro_report', JSON.stringify(newReport))
      setReport(newReport)
    } catch {
      // silently fail, keep existing report
    } finally {
      setIsRegenerating(false)
    }
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar sections={SECTIONS} activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CP</span>
            </div>
            <span className="font-semibold text-foreground">CreadorPro AI</span>
          </div>
          <div className="flex items-center gap-3">
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">¿Regenerar plan?</span>
                <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
                <Button
                  size="sm"
                  onClick={handleRegenerate}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                >
                  Confirmar
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(true)}
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerando...</>
                ) : (
                  <><RefreshCw className="mr-2 h-4 w-4" /> Regenerar Plan</>
                )}
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
          {/* Metrics */}
          <MetricsSummary report={report} />

          {/* Report sections */}
          <div className="mt-8 space-y-6">
            {SECTIONS.map(({ id, title, icon }) => (
              <ReportCard
                key={id}
                id={id}
                title={title}
                icon={icon}
                content={report[id]}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
