'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Goal } from '@/lib/types'
import { ArrowRight, ArrowLeft, Target, Users, Star, User, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepGoalsProps {
  data: Goal[]
  onNext: (goals: Goal[]) => void
  onBack: () => void
}

const GOALS: { id: Goal; label: string; description: string; icon: React.ElementType }[] = [
  { id: 'ganar_clientes', label: 'Ganar clientes', description: 'Conseguir nuevos clientes de forma consistente', icon: Users },
  { id: 'escalar_agencia', label: 'Escalar agencia', description: 'Crecer hacia una micro-agencia o equipo', icon: Target },
  { id: 'servicios_premium', label: 'Servicios premium', description: 'Vender servicios de alto valor', icon: Star },
  { id: 'marca_personal', label: 'Marca personal', description: 'Construir y posicionar tu marca personal', icon: User },
  { id: 'nicho_rentable', label: 'Nicho rentable', description: 'Identificar y dominar un nicho de mercado', icon: Compass },
]

export default function StepGoals({ data, onNext, onBack }: StepGoalsProps) {
  const [selected, setSelected] = useState<Goal[]>(data)
  const [error, setError] = useState<string | null>(null)

  const toggle = (goal: Goal) => {
    setError(null)
    setSelected(prev => {
      if (prev.includes(goal)) return prev.filter(g => g !== goal)
      if (prev.length >= 3) return prev
      return [...prev, goal]
    })
  }

  const handleNext = () => {
    if (selected.length === 0) {
      setError('Selecciona al menos un objetivo')
      return
    }
    onNext(selected)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tus Objetivos</h1>
        <p className="text-muted-foreground">Selecciona hasta 3 objetivos que más te importan ahora mismo.</p>
      </div>

      <div className="grid gap-3">
        {GOALS.map(({ id, label, description, icon: Icon }) => {
          const isSelected = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all duration-200',
                'flex items-center gap-4',
                isSelected
                  ? 'border-violet-500 bg-violet-950/30 text-foreground'
                  : 'border-border bg-card text-foreground hover:border-violet-800 hover:bg-card/80'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                isSelected ? 'bg-gradient-to-br from-violet-600 to-indigo-600' : 'bg-secondary'
              )}>
                <Icon className={cn('h-5 w-5', isSelected ? 'text-white' : 'text-muted-foreground')} />
              </div>
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
              </div>
              {isSelected && (
                <div className="ml-auto w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <p className="text-xs text-muted-foreground">{selected.length}/3 objetivos seleccionados</p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} size="lg" className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
        >
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
