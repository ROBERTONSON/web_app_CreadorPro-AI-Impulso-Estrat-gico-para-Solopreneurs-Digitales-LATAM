'use client'

import type { StrategyReport, WizardData } from '@/lib/types'
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react'
import { calculateNicheScore } from '@/lib/score'

interface ExecutiveSummaryProps {
  report: StrategyReport
  wizardData?: WizardData | null
}

const DIFFICULTY_CONFIG = {
  bajo: { label: 'Baja competencia', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  medio: { label: 'Competencia media', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  alto: { label: 'Alta competencia', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export default function ExecutiveSummary({ report, wizardData }: ExecutiveSummaryProps) {
  const goals = wizardData?.goals ?? []

  return (
    <div className="space-y-6">
      {/* Executive summary card */}
      <div className="bg-gradient-to-br from-violet-950/40 to-indigo-950/40 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h2 className="font-semibold text-foreground">Resumen Ejecutivo</h2>
        </div>
        <p className="text-foreground leading-relaxed">{report.executive_summary}</p>
      </div>

      {/* Top 3 opportunities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-violet-400" />
          <h2 className="font-semibold text-foreground">Top 3 Oportunidades Recomendadas</h2>
        </div>
        <div className="grid gap-3">
          {report.top_3_opportunities.map((opp, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                {i + 1}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{opp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Niches with score + difficulty badges */}
      <div>
        <h2 className="font-semibold text-foreground mb-4">Nichos Recomendados</h2>
        <div className="grid gap-4">
          {report.niches.map((niche, i) => {
            const diff = DIFFICULTY_CONFIG[niche.difficulty] ?? DIFFICULTY_CONFIG.medio
            const score = calculateNicheScore(niche, goals)
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-medium text-foreground">{niche.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${diff.color}`}>
                    {diff.label}
                  </span>
                </div>

                {/* Score bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${score.color}`}>{score.label}</span>
                    <span className={`text-xs font-bold ${score.color}`}>{score.total}/100</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${score.barColor}`}
                      style={{ width: `${score.total}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">{niche.economic_potential}</span>
                </div>
                {niche.why && (
                  <p className="text-sm text-muted-foreground">{niche.why}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Market alert if any niche is high difficulty */}
      {report.niches.some(n => n.difficulty === 'alto') && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-400">Mercado muy competitivo detectado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Uno o más nichos tienen alta competencia. Enfócate en los diferenciadores y en un sub-nicho más específico para destacar.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
