'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CommunicationStyle } from '@/lib/types'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepStyleProps {
  data: CommunicationStyle | null
  onSubmit: (style: CommunicationStyle) => void
  onBack: () => void
  isGenerating: boolean
}

const STYLES: { id: CommunicationStyle; label: string; description: string; emoji: string }[] = [
  { id: 'profesional', label: 'Profesional', description: 'Formal, directo y orientado a resultados', emoji: '💼' },
  { id: 'cercano', label: 'Cercano', description: 'Conversacional y empático, como un amigo experto', emoji: '🤝' },
  { id: 'premium', label: 'Premium', description: 'Exclusivo y sofisticado, enfocado en alto valor', emoji: '✨' },
  { id: 'creativo', label: 'Creativo', description: 'Innovador y fresco, con lenguaje inspirador', emoji: '🎨' },
  { id: 'autoridad', label: 'Autoridad', description: 'Experto y contundente, basado en experiencia', emoji: '🎯' },
]

export default function StepStyle({ data, onSubmit, onBack, isGenerating }: StepStyleProps) {
  const [selected, setSelected] = useState<CommunicationStyle | null>(data)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!selected) {
      setError('Selecciona un estilo de comunicación')
      return
    }
    onSubmit(selected)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tu Estilo de Comunicación</h1>
        <p className="text-muted-foreground">Elige el tono que mejor representa tu marca personal.</p>
      </div>

      <div className="grid gap-3">
        {STYLES.map(({ id, label, description, emoji }) => {
          const isSelected = selected === id
          return (
            <button
              key={id}
              onClick={() => { setSelected(id); setError(null) }}
              disabled={isGenerating}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all duration-200',
                'flex items-center gap-4',
                isSelected
                  ? 'border-violet-500 bg-violet-950/30 text-foreground'
                  : 'border-border bg-card text-foreground hover:border-violet-800 hover:bg-card/80',
                isGenerating && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl',
                isSelected ? 'bg-gradient-to-br from-violet-600 to-indigo-600' : 'bg-secondary'
              )}>
                {emoji}
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

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} size="lg" className="flex-1" disabled={isGenerating}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
        </Button>
        <Button
          onClick={handleSubmit}
          size="lg"
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando tu plan...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar mi Plan
            </>
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">La IA está analizando tu perfil...</p>
          <p className="text-xs text-muted-foreground">Esto puede tomar hasta 30 segundos</p>
        </div>
      )}
    </div>
  )
}
