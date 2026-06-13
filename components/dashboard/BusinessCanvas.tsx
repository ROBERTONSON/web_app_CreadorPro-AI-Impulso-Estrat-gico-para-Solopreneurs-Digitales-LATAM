'use client'

import { useState } from 'react'
import type { StrategyReport, WizardData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'

interface Canvas {
  key_partners: string[]
  key_activities: string[]
  key_resources: string[]
  value_propositions: string[]
  customer_relationships: string[]
  channels: string[]
  customer_segments: string[]
  cost_structure: string[]
  revenue_streams: string[]
}

interface BusinessCanvasProps {
  report: StrategyReport
  wizardData: WizardData | null
}

const BLOCKS: { key: keyof Canvas; label: string; color: string; description: string }[] = [
  { key: 'key_partners',         label: 'Socios Clave',           color: 'border-violet-800 bg-violet-950/20',  description: 'Aliados y proveedores estratégicos' },
  { key: 'key_activities',       label: 'Actividades Clave',      color: 'border-indigo-800 bg-indigo-950/20',  description: 'Lo que hacés para entregar valor' },
  { key: 'key_resources',        label: 'Recursos Clave',         color: 'border-blue-800 bg-blue-950/20',      description: 'Activos esenciales del negocio' },
  { key: 'value_propositions',   label: 'Propuesta de Valor',     color: 'border-emerald-800 bg-emerald-950/20', description: 'Por qué te eligen a vos' },
  { key: 'customer_relationships',label: 'Relación con Clientes', color: 'border-teal-800 bg-teal-950/20',      description: 'Cómo interactuás con ellos' },
  { key: 'channels',             label: 'Canales',                color: 'border-cyan-800 bg-cyan-950/20',      description: 'Cómo llegás a tus clientes' },
  { key: 'customer_segments',    label: 'Segmentos de Clientes',  color: 'border-pink-800 bg-pink-950/20',      description: 'A quién le servís' },
  { key: 'cost_structure',       label: 'Estructura de Costos',   color: 'border-red-800 bg-red-950/20',        description: 'Principales gastos del negocio' },
  { key: 'revenue_streams',      label: 'Fuentes de Ingresos',    color: 'border-amber-800 bg-amber-950/20',    description: 'Cómo generás dinero' },
]

export default function BusinessCanvas({ report, wizardData }: BusinessCanvasProps) {
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!wizardData) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/business-canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wizardData, report }),
      })
      if (res.status === 429) { setError('Límite de solicitudes alcanzado. Intentá en un momento.'); return }
      if (!res.ok) throw new Error()
      const data: Canvas = await res.json()
      setCanvas(data)
    } catch {
      setError('No se pudo generar el canvas. Intentá de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!canvas) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Generá tu Business Model Canvas personalizado basado en tu perfil y plan estratégico.
        </p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button
          onClick={generate}
          disabled={isLoading}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
        >
          {isLoading
            ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generando canvas...</>
            : 'Generar Business Model Canvas'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Canvas generado para tu perfil en {wizardData?.profile.country_city}</p>
        <Button variant="outline" size="sm" onClick={generate} disabled={isLoading} className="h-8 text-xs gap-1.5">
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Regenerar
        </Button>
      </div>

      {/* Canvas grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BLOCKS.map(({ key, label, color, description }) => (
          <CanvasBlock
            key={key}
            label={label}
            description={description}
            items={canvas[key] ?? []}
            colorClass={color}
            featured={key === 'value_propositions'}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        * Basado en el modelo de Osterwalder. Usalo como punto de partida y ajustá según tu experiencia real.
      </p>
    </div>
  )
}

function CanvasBlock({
  label, description, items, colorClass, featured,
}: {
  label: string
  description: string
  items: string[]
  colorClass: string
  featured?: boolean
}) {
  return (
    <div className={`border rounded-xl p-4 space-y-3 ${colorClass} ${featured ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
      <div>
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-xs text-foreground/90">
            <span className="text-violet-400 flex-shrink-0 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
