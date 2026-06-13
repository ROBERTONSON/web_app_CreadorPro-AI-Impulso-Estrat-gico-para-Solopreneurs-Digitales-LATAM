'use client'

import { useState, useMemo } from 'react'
import type { StrategyReport } from '@/lib/types'
import { DollarSign, TrendingUp, Users, Calculator } from 'lucide-react'

interface IncomeCalculatorProps {
  report: StrategyReport
}

function extractUSDRange(potential: string): { min: number; max: number } {
  const regex = /USD\s*([\d,]+)/gi
  const found: number[] = []
  let m: RegExpExecArray | null
  while ((m = regex.exec(potential)) !== null) {
    found.push(parseInt(m[1].replace(/,/g, '')))
  }
  if (found.length >= 2) return { min: found[0], max: found[1] }
  if (found.length === 1) return { min: found[0], max: found[0] * 2 }
  return { min: 500, max: 2000 }
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('es-LATAM', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export default function IncomeCalculator({ report }: IncomeCalculatorProps) {
  const niches = report.niches ?? []
  const [selectedNiche, setSelectedNiche] = useState(niches[0]?.name ?? '')
  const [clients, setClients] = useState(3)
  const [pricePerClient, setPricePerClient] = useState(500)
  const [hoursPerClient, setHoursPerClient] = useState(10)
  const [hoursPerDay, setHoursPerDay] = useState(4)

  const selectedNicheData = niches.find(n => n.name === selectedNiche)
  const range = selectedNicheData ? extractUSDRange(selectedNicheData.economic_potential) : { min: 500, max: 2000 }

  const calc = useMemo(() => {
    const monthly = clients * pricePerClient
    const annual = monthly * 12
    const totalHours = clients * hoursPerClient
    const workingDays = hoursPerDay > 0 ? Math.ceil(totalHours / hoursPerDay) : 0
    const hourlyRate = totalHours > 0 ? monthly / totalHours : 0
    const freeDays = 30 - workingDays
    return { monthly, annual, totalHours, workingDays, freeDays: Math.max(0, freeDays), hourlyRate }
  }, [clients, pricePerClient, hoursPerClient, hoursPerDay])

  const marketPosition = pricePerClient < range.min
    ? { label: 'Por debajo del mercado', color: 'text-amber-400', hint: `El nicho soporta hasta ${formatUSD(range.max)}/cliente` }
    : pricePerClient > range.max
    ? { label: 'Premium — por encima del mercado', color: 'text-violet-400', hint: 'Asegurate de justificar el precio con tu propuesta de valor' }
    : { label: 'Dentro del rango de mercado', color: 'text-emerald-400', hint: `Rango sugerido: ${formatUSD(range.min)} – ${formatUSD(range.max)}` }

  return (
    <div className="space-y-6">
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

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SliderInput
          label="Clientes por mes"
          value={clients}
          min={1} max={20} step={1}
          onChange={setClients}
          display={`${clients} cliente${clients !== 1 ? 's' : ''}`}
        />
        <SliderInput
          label="Precio por cliente (USD)"
          value={pricePerClient}
          min={100} max={5000} step={50}
          onChange={setPricePerClient}
          display={formatUSD(pricePerClient)}
          hint={<span className={`text-xs ${marketPosition.color}`}>{marketPosition.label}</span>}
        />
        <SliderInput
          label="Horas dedicadas por cliente"
          value={hoursPerClient}
          min={1} max={80} step={1}
          onChange={setHoursPerClient}
          display={`${hoursPerClient} hs`}
        />
        <SliderInput
          label="Horas de trabajo por día"
          value={hoursPerDay}
          min={1} max={12} step={1}
          onChange={setHoursPerDay}
          display={`${hoursPerDay} hs/día`}
        />
      </div>

      {/* Market hint */}
      <p className="text-xs text-muted-foreground">{marketPosition.hint}</p>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard
          icon={DollarSign}
          label="Ingreso mensual"
          value={formatUSD(calc.monthly)}
          color="from-violet-600 to-indigo-600"
        />
        <ResultCard
          icon={TrendingUp}
          label="Ingreso anual"
          value={formatUSD(calc.annual)}
          color="from-indigo-600 to-blue-600"
        />
        <ResultCard
          icon={Calculator}
          label="Tarifa por hora"
          value={formatUSD(calc.hourlyRate)}
          color="from-blue-600 to-cyan-600"
        />
        <ResultCard
          icon={Users}
          label="Días libres/mes"
          value={`${calc.freeDays} días`}
          color="from-emerald-600 to-teal-600"
        />
      </div>

      {/* Breakdown */}
      <div className="bg-background border border-border rounded-xl p-4 space-y-2.5 text-sm">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Desglose mensual</p>
        <Row label="Clientes" value={`${clients}`} />
        <Row label="Precio por cliente" value={formatUSD(pricePerClient)} />
        <Row label="Horas totales trabajadas" value={`${calc.totalHours} hs`} />
        <Row label="Días de trabajo necesarios" value={`${calc.workingDays} días`} />
        <div className="border-t border-border pt-2 mt-2">
          <Row label="Ingreso bruto mensual" value={formatUSD(calc.monthly)} highlight />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        * Cálculo estimado. No incluye impuestos, gastos operativos ni comisiones de plataformas.
      </p>
    </div>
  )
}

function SliderInput({
  label, value, min, max, step, onChange, display, hint,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  display: string
  hint?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        <span className="text-sm font-semibold text-foreground">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full bg-border accent-violet-600 cursor-pointer"
      />
      {hint && <div>{hint}</div>}
    </div>
  )
}

function ResultCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2">
      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="text-base font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground leading-tight">{label}</div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs ${highlight ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{label}</span>
      <span className={`text-xs font-mono ${highlight ? 'text-emerald-400 font-bold' : 'text-foreground'}`}>{value}</span>
    </div>
  )
}
