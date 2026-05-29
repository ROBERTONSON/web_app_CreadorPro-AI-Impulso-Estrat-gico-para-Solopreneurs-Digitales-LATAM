'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { StrategyReport, WizardData } from '@/lib/types'
import Sidebar from '@/components/dashboard/Sidebar'
import MetricsSummary from '@/components/dashboard/MetricsSummary'
import ReportCard from '@/components/dashboard/ReportCard'
import ExecutiveSummary from '@/components/dashboard/ExecutiveSummary'
import SwotCard from '@/components/dashboard/SwotCard'
import SevenDayPlan from '@/components/dashboard/SevenDayPlan'
import BioCard from '@/components/dashboard/BioCard'
import { Button } from '@/components/ui/button'
import {
  Lightbulb, Briefcase, BookOpen, PenSquare,
  Zap, Users, DollarSign, Mic, Map, Link2, Camera,
  UserCheck, Trophy, FileText, RefreshCw, Loader2,
  Copy, Check, Download, Hash, MessageSquare,
  AlertOctagon, Wrench, Calendar, UserPlus, TrendingUp,
  BarChart3
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface Section {
  id: string
  title: string
  icon: LucideIcon
  group: 'summary' | 'strategy' | 'content' | 'business' | 'analysis'
}

const SECTIONS: Section[] = [
  // Summary
  { id: 'executive', title: 'Resumen Ejecutivo', icon: TrendingUp, group: 'summary' },
  { id: 'seven_day_plan', title: 'Plan de 7 Días', icon: Calendar, group: 'summary' },

  // Strategy
  { id: 'value_proposition', title: 'Propuesta de Valor', icon: Lightbulb, group: 'strategy' },
  { id: 'suggested_services', title: 'Servicios Sugeridos', icon: Briefcase, group: 'strategy' },
  { id: 'pricing_suggestions', title: 'Precios Sugeridos', icon: DollarSign, group: 'strategy' },
  { id: 'differentiators', title: 'Diferenciadores', icon: Zap, group: 'strategy' },
  { id: 'competitive_positioning', title: 'Posicionamiento', icon: Trophy, group: 'strategy' },

  // Acquisition
  { id: 'acquisition_strategy', title: 'Estrategia de Captación', icon: Users, group: 'strategy' },
  { id: 'prospecting_messages', title: 'Mensajes de Prospección', icon: MessageSquare, group: 'strategy' },
  { id: 'first_ideal_client', title: 'Primer Cliente Ideal', icon: UserPlus, group: 'strategy' },

  // Content
  { id: 'content_strategy', title: 'Estrategia de Contenido', icon: BookOpen, group: 'content' },
  { id: 'post_ideas', title: 'Ideas de Publicaciones', icon: PenSquare, group: 'content' },
  { id: 'post_hooks', title: 'Hooks para Posts', icon: Hash, group: 'content' },
  { id: 'first_30_days_content', title: 'Contenido 30 Días', icon: Calendar, group: 'content' },
  { id: 'linkedin_strategy', title: 'Estrategia LinkedIn', icon: Link2, group: 'content' },
  { id: 'instagram_strategy', title: 'Estrategia Instagram', icon: Camera, group: 'content' },
  { id: 'bios', title: 'Bios Optimizadas', icon: UserCheck, group: 'content' },

  // Business
  { id: 'commercial_offer', title: 'Oferta Comercial', icon: DollarSign, group: 'business' },
  { id: 'pitch', title: 'Pitch Profesional', icon: Mic, group: 'business' },
  { id: 'growth_roadmap', title: 'Roadmap de Crecimiento', icon: Map, group: 'business' },
  { id: 'useful_tools', title: 'Herramientas Útiles', icon: Wrench, group: 'business' },
  { id: 'common_mistakes', title: 'Errores a Evitar', icon: AlertOctagon, group: 'business' },

  // Analysis
  { id: 'swot', title: 'Análisis FODA', icon: BarChart3, group: 'analysis' },
  { id: 'ideal_clients', title: 'Clientes Ideales', icon: UserCheck, group: 'analysis' },
  { id: 'first_content', title: 'Primer Contenido', icon: FileText, group: 'analysis' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [report, setReport] = useState<StrategyReport | null>(null)
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('executive')
  const [copiedAll, setCopiedAll] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

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
      // keep existing report
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleRegenerateSection = useCallback(async (sectionKey: keyof StrategyReport) => {
    if (!wizardData || !report) return
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...wizardData, regenerate_section: sectionKey }),
      })
      if (!res.ok) return
      const newReport: StrategyReport = await res.json()
      const updated = { ...report, [sectionKey]: newReport[sectionKey] }
      sessionStorage.setItem('creadorpro_report', JSON.stringify(updated))
      setReport(updated)
    } catch {
      // silently fail
    }
  }, [wizardData, report])

  const handleCopyAll = async () => {
    if (!report) return
    const text = [
      `CREADORPRO AI — TU PLAN ESTRATÉGICO\n`,
      `RESUMEN EJECUTIVO\n${report.executive_summary}\n`,
      `TOP 3 OPORTUNIDADES\n${report.top_3_opportunities.join('\n')}\n`,
      `PROPUESTA DE VALOR\n${report.value_proposition}\n`,
      `SERVICIOS SUGERIDOS\n${report.suggested_services.join('\n')}\n`,
      `PRECIOS SUGERIDOS\n${report.pricing_suggestions.join('\n')}\n`,
      `PLAN DE 7 DÍAS\n${report.seven_day_plan.join('\n')}\n`,
      `PITCH PROFESIONAL\n${report.pitch}\n`,
      `ESTRATEGIA DE CAPTACIÓN\n${report.acquisition_strategy}\n`,
      `MENSAJES DE PROSPECCIÓN\n${report.prospecting_messages.join('\n')}\n`,
      `HOOKS PARA POSTS\n${report.post_hooks.join('\n')}\n`,
      `BIO LINKEDIN\n${report.linkedin_bio}\n`,
      `BIO INSTAGRAM\n${report.instagram_bio}\n`,
      `ERRORES A EVITAR\n${report.common_mistakes.join('\n')}\n`,
      `HERRAMIENTAS ÚTILES\n${report.useful_tools.join('\n')}\n`,
    ].join('\n')
    await navigator.clipboard.writeText(text)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 3000)
  }

  const handleExportPdf = async () => {
    if (!report) return
    setIsExportingPdf(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      const maxWidth = pageWidth - margin * 2
      let y = 20

      const addText = (text: string, size: number, bold = false, color: [number, number, number] = [245, 245, 245]) => {
        doc.setFontSize(size)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.setTextColor(...color)
        const lines = doc.splitTextToSize(text, maxWidth)
        if (y + lines.length * (size * 0.4) > 280) {
          doc.addPage()
          y = 20
        }
        doc.text(lines, margin, y)
        y += lines.length * (size * 0.4) + 4
      }

      const addSection = (title: string, content: string | string[]) => {
        y += 4
        addText(title, 11, true, [167, 139, 250])
        const text = Array.isArray(content) ? content.map((c, i) => `${i + 1}. ${c}`).join('\n') : content
        addText(text, 9, false, [200, 200, 200])
        y += 2
      }

      // Background
      doc.setFillColor(10, 10, 10)
      doc.rect(0, 0, pageWidth, 297, 'F')

      // Title
      addText('CREADORPRO AI', 20, true, [167, 139, 250])
      addText('Tu Plan Estratégico Personalizado', 12, false, [163, 163, 163])
      y += 4

      addSection('RESUMEN EJECUTIVO', report.executive_summary)
      addSection('TOP 3 OPORTUNIDADES', report.top_3_opportunities)
      addSection('PROPUESTA DE VALOR', report.value_proposition)
      addSection('SERVICIOS SUGERIDOS', report.suggested_services)
      addSection('PRECIOS SUGERIDOS', report.pricing_suggestions)
      addSection('PLAN DE 7 DÍAS', report.seven_day_plan)
      addSection('PITCH PROFESIONAL', report.pitch)
      addSection('ESTRATEGIA DE CAPTACIÓN', report.acquisition_strategy)
      addSection('MENSAJES DE PROSPECCIÓN', report.prospecting_messages)
      addSection('IDEAS DE PUBLICACIONES', report.post_ideas)
      addSection('HOOKS PARA POSTS', report.post_hooks)
      addSection('BIO LINKEDIN', report.linkedin_bio)
      addSection('BIO INSTAGRAM', report.instagram_bio)
      addSection('ERRORES A EVITAR', report.common_mistakes)
      addSection('HERRAMIENTAS ÚTILES', report.useful_tools)
      addSection('ROADMAP DE CRECIMIENTO', report.growth_roadmap)

      doc.save('creadorpro-ai-plan-estrategico.pdf')
    } catch (e) {
      console.error('PDF export error:', e)
    } finally {
      setIsExportingPdf(false)
    }
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold">CP</span>
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        <p className="text-sm text-muted-foreground">Cargando tu plan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar sections={SECTIONS} activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CP</span>
            </div>
            <span className="font-semibold text-foreground text-sm hidden sm:block">CreadorPro AI</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy all */}
            <Button variant="outline" size="sm" onClick={handleCopyAll} className="h-8 text-xs gap-1.5">
              {copiedAll ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span className="hidden sm:inline">{copiedAll ? 'Copiado' : 'Copiar todo'}</span>
            </Button>

            {/* Export PDF */}
            <Button variant="outline" size="sm" onClick={handleExportPdf} disabled={isExportingPdf} className="h-8 text-xs gap-1.5">
              {isExportingPdf ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
              <span className="hidden sm:inline">PDF</span>
            </Button>

            {/* Regenerate */}
            {showConfirm ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground hidden sm:inline">¿Regenerar?</span>
                <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)} className="h-8 text-xs">No</Button>
                <Button size="sm" onClick={handleRegenerate} className="h-8 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white">Sí</Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowConfirm(true)} disabled={isRegenerating} className="h-8 text-xs gap-1.5">
                {isRegenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                <span className="hidden sm:inline">{isRegenerating ? 'Regenerando...' : 'Regenerar'}</span>
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-8 max-w-4xl mx-auto w-full">
          <MetricsSummary report={report} />

          <div className="mt-8 space-y-6">
            {/* Executive Summary + Top 3 + Niches */}
            <div id="executive" className="scroll-mt-20">
              <ExecutiveSummary report={report} />
            </div>

            {/* 7-day plan */}
            <div id="seven_day_plan" className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-20">
              <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 bg-gradient-to-r from-violet-950/20 to-indigo-950/20">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5 text-white" />
                </div>
                <h2 className="font-semibold text-foreground text-sm">Plan de 7 Días — Empieza Hoy</h2>
              </div>
              <div className="px-5 py-4">
                <SevenDayPlan plan={report.seven_day_plan} />
              </div>
            </div>

            {/* Strategy sections */}
            <ReportCard id="value_proposition" title="Propuesta de Valor" icon={Lightbulb} content={report.value_proposition} onRegenerate={() => handleRegenerateSection('value_proposition')} />
            <ReportCard id="suggested_services" title="Servicios Sugeridos" icon={Briefcase} content={report.suggested_services} onRegenerate={() => handleRegenerateSection('suggested_services')} />
            <ReportCard id="pricing_suggestions" title="Precios Sugeridos para LATAM" icon={DollarSign} content={report.pricing_suggestions} onRegenerate={() => handleRegenerateSection('pricing_suggestions')} />
            <ReportCard id="differentiators" title="Diferenciadores Competitivos" icon={Zap} content={report.differentiators} onRegenerate={() => handleRegenerateSection('differentiators')} />
            <ReportCard id="competitive_positioning" title="Posicionamiento Competitivo" icon={Trophy} content={report.competitive_positioning} onRegenerate={() => handleRegenerateSection('competitive_positioning')} />
            <ReportCard id="acquisition_strategy" title="Estrategia de Captación" icon={Users} content={report.acquisition_strategy} onRegenerate={() => handleRegenerateSection('acquisition_strategy')} />
            <ReportCard id="prospecting_messages" title="Mensajes de Prospección" icon={MessageSquare} content={report.prospecting_messages} onRegenerate={() => handleRegenerateSection('prospecting_messages')} />
            <ReportCard id="first_ideal_client" title="Primer Cliente Ideal a Buscar" icon={UserPlus} content={report.first_ideal_client} onRegenerate={() => handleRegenerateSection('first_ideal_client')} />

            {/* Content sections */}
            <ReportCard id="content_strategy" title="Estrategia de Contenido" icon={BookOpen} content={report.content_strategy} onRegenerate={() => handleRegenerateSection('content_strategy')} />
            <ReportCard id="post_ideas" title="Ideas de Publicaciones" icon={PenSquare} content={report.post_ideas} onRegenerate={() => handleRegenerateSection('post_ideas')} />
            <ReportCard id="post_hooks" title="Hooks para Publicaciones" icon={Hash} content={report.post_hooks} onRegenerate={() => handleRegenerateSection('post_hooks')} />
            <ReportCard id="first_30_days_content" title="Contenido Primeros 30 Días" icon={Calendar} content={report.first_30_days_content} onRegenerate={() => handleRegenerateSection('first_30_days_content')} />
            <ReportCard id="linkedin_strategy" title="Estrategia LinkedIn" icon={Link2} content={report.linkedin_strategy} onRegenerate={() => handleRegenerateSection('linkedin_strategy')} />
            <ReportCard id="instagram_strategy" title="Estrategia Instagram" icon={Camera} content={report.instagram_strategy} onRegenerate={() => handleRegenerateSection('instagram_strategy')} />

            {/* Bios */}
            <div id="bios" className="scroll-mt-20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <UserCheck className="h-3.5 w-3.5 text-white" />
                </div>
                <h2 className="font-semibold text-foreground text-sm">Bios Optimizadas</h2>
              </div>
              <BioCard linkedinBio={report.linkedin_bio} instagramBio={report.instagram_bio} />
            </div>

            {/* Business sections */}
            <ReportCard id="commercial_offer" title="Oferta Comercial" icon={DollarSign} content={report.commercial_offer} onRegenerate={() => handleRegenerateSection('commercial_offer')} />
            <ReportCard id="pitch" title="Pitch Profesional" icon={Mic} content={report.pitch} onRegenerate={() => handleRegenerateSection('pitch')} />
            <ReportCard id="growth_roadmap" title="Roadmap de Crecimiento" icon={Map} content={report.growth_roadmap} onRegenerate={() => handleRegenerateSection('growth_roadmap')} />
            <ReportCard id="useful_tools" title="Herramientas Útiles" icon={Wrench} content={report.useful_tools} />
            <ReportCard id="common_mistakes" title="Errores Comunes a Evitar" icon={AlertOctagon} content={report.common_mistakes} />

            {/* SWOT */}
            <div id="swot" className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-20">
              <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 bg-gradient-to-r from-violet-950/20 to-indigo-950/20">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <BarChart3 className="h-3.5 w-3.5 text-white" />
                </div>
                <h2 className="font-semibold text-foreground text-sm">Análisis FODA</h2>
              </div>
              <div className="px-5 py-4">
                <SwotCard swot={report.swot} />
              </div>
            </div>

            <ReportCard id="ideal_clients" title="Clientes Ideales" icon={UserCheck} content={report.ideal_clients} onRegenerate={() => handleRegenerateSection('ideal_clients')} />
            <ReportCard id="first_content" title="Primer Contenido a Publicar" icon={FileText} content={report.first_content} onRegenerate={() => handleRegenerateSection('first_content')} />
          </div>
        </main>
      </div>
    </div>
  )
}
