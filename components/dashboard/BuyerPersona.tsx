'use client'

import { useState } from 'react'
import type { StrategyReport, WizardData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Users, Loader2, MapPin, Briefcase, DollarSign, AlertCircle, Target, MessageSquare, Radio, Zap } from 'lucide-react'

interface BuyerPersonaProps {
  report: StrategyReport
  wizardData: WizardData | null
}

interface Persona {
  name: string
  age: string
  location: string
  occupation: string
  income: string
  pain_points: string[]
  goals: string[]
  objections: string[]
  channels: string[]
  buying_trigger: string
  message: string
}

export default function BuyerPersona({ report, wizardData }: BuyerPersonaProps) {
  const [persona, setPersona] = useState<Persona | null>(null)
  const [selectedNiche, setSelectedNiche] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const niches = report.niches.map(n => n.name)

  const generate = async () => {
    if (!wizardData || !selectedNiche) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/buyer-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wizardData, nicheName: selectedNiche }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data.error === 'rate_limit') throw new Error('Límite de IA alcanzado. Intenta en unos minutos.')
        throw new Error(data.error ?? 'Error al generar')
      }
      const data = await res.json()
      setPersona(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el Buyer Persona')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Niche selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedNiche}
          onChange={e => setSelectedNiche(e.target.value)}
          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Selecciona un nicho...</option>
          {niches.map((n, i) => (
            <option key={i} value={n}>{n}</option>
          ))}
        </select>
        <Button
          onClick={generate}
          disabled={!selectedNiche || isLoading || !wizardData}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
        >
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</> : <><Users className="mr-2 h-4 w-4" /> Generar Buyer Persona</>}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-800 bg-red-950/50 text-red-400 text-sm">{error}</div>
      )}

      {persona && (
        <div className="bg-gradient-to-br from-violet-950/20 to-indigo-950/20 border border-violet-500/20 rounded-2xl p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {persona.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">{persona.name}</h3>
              <p className="text-sm text-muted-foreground">{persona.age}</p>
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: MapPin, label: persona.location },
              { icon: Briefcase, label: persona.occupation },
              { icon: DollarSign, label: persona.income },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                <Icon className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                <span className="text-xs text-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Pain points, goals, objections */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: AlertCircle, title: 'Problemas', items: persona.pain_points, color: 'text-red-400' },
              { icon: Target, title: 'Objetivos', items: persona.goals, color: 'text-emerald-400' },
              { icon: MessageSquare, title: 'Objeciones', items: persona.objections, color: 'text-amber-400' },
            ].map(({ icon: Icon, title, items, color }) => (
              <div key={title}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                  <span className={`text-xs font-semibold ${color}`}>{title}</span>
                </div>
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Channels */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Radio className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">Dónde encontrarlo</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {persona.channels.map((c, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">{c}</span>
              ))}
            </div>
          </div>

          {/* Buying trigger */}
          <div className="p-3 rounded-lg border border-violet-500/20 bg-violet-950/20">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400">Trigger de compra</span>
            </div>
            <p className="text-sm text-foreground">{persona.buying_trigger}</p>
          </div>

          {/* Key message */}
          <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20">
            <p className="text-xs font-semibold text-emerald-400 mb-1">Mensaje clave para este cliente</p>
            <p className="text-sm text-foreground italic">&ldquo;{persona.message}&rdquo;</p>
          </div>
        </div>
      )}

      {!persona && !isLoading && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Selecciona un nicho y genera tu Buyer Persona para conocer exactamente a quién le hablas.
        </p>
      )}
    </div>
  )
}
