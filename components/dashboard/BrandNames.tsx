'use client'

import { useState } from 'react'
import type { StrategyReport, WizardData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, Copy, Check, Lightbulb } from 'lucide-react'
interface BrandName {
  name: string
  type: string
  meaning: string
  domain_hint: string
  slogan: string
}

interface BrandNamesResult {
  names: BrandName[]
  naming_tips: string[]
}

interface BrandNamesProps {
  report: StrategyReport
  wizardData: WizardData | null
}

export default function BrandNames({ report, wizardData }: BrandNamesProps) {
  const niches = report.niches ?? []
  const [selectedNiche, setSelectedNiche] = useState(niches[0]?.name ?? '')
  const [result, setResult] = useState<BrandNamesResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generate = async (nicheName: string) => {
    if (!wizardData) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/brand-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wizardData, nicheName }),
      })
      if (res.status === 429) { setError('Límite de solicitudes alcanzado. Intenta en un momento.'); return }
      if (!res.ok) throw new Error()
      const data: BrandNamesResult = await res.json()
      setResult(data)
    } catch {
      setError('No se pudieron generar los nombres. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const typeColors: Record<string, string> = {
    personal: 'bg-violet-950/50 text-violet-300 border-violet-800',
    creativo: 'bg-indigo-950/50 text-indigo-300 border-indigo-800',
    descriptivo: 'bg-blue-950/50 text-blue-300 border-blue-800',
    abstracto: 'bg-purple-950/50 text-purple-300 border-purple-800',
  }

  return (
    <div className="space-y-5">
      {/* Niche selector */}
      {niches.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {niches.map(n => (
            <button
              key={n.name}
              onClick={() => setSelectedNiche(n.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedNiche === n.name
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-card text-muted-foreground border-border hover:border-violet-700'
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>
      )}

      {/* Generate button */}
      {!result ? (
        <Button
          onClick={() => generate(selectedNiche)}
          disabled={isLoading || !selectedNiche}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
        >
          {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generando nombres...</> : 'Generar nombres de marca'}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => generate(selectedNiche)}
          disabled={isLoading}
          className="gap-1.5 text-xs h-8"
        >
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Regenerar
        </Button>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Results */}
      {result && (
        <div className="space-y-5">
          <div className="grid gap-3">
            {result.names.map((item, i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-foreground">{item.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[item.type] ?? 'bg-card text-muted-foreground border-border'}`}>
                      {item.type}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 flex-shrink-0"
                    onClick={() => handleCopy(`${item.name} — "${item.slogan}"`, i)}
                    title="Copiar nombre y eslogan"
                  >
                    {copiedIndex === i ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                  </Button>
                </div>

                <p className="text-sm text-violet-300 italic">&ldquo;{item.slogan}&rdquo;</p>
                <p className="text-xs text-muted-foreground">{item.meaning}</p>
                <p className="text-xs text-muted-foreground/60 font-mono">{item.domain_hint}</p>
              </div>
            ))}
          </div>

          {/* Naming tips */}
          {result.naming_tips?.length > 0 && (
            <div className="bg-violet-950/20 border border-violet-900/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Consejos para elegir</span>
              </div>
              <ul className="space-y-1.5">
                {result.naming_tips.map((tip, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-violet-500 flex-shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
