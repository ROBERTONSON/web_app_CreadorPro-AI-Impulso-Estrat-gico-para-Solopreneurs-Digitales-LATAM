'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import StepProfile from '@/components/wizard/StepProfile'
import StepGoals from '@/components/wizard/StepGoals'
import StepStyle from '@/components/wizard/StepStyle'
import type { Profile, Goal, CommunicationStyle, WizardData, StrategyReport } from '@/lib/types'
import { Clock, AlertTriangle } from 'lucide-react'

type WizardStep = 1 | 2 | 3

interface WizardState {
  step: WizardStep
  profile: Profile | null
  goals: Goal[]
  style: CommunicationStyle | null
  isGenerating: boolean
  error: string | null
  isRateLimit: boolean
  retryAfter: number | null
}

function formatWaitTime(seconds: number | null): string {
  if (!seconds) return 'unos minutos'
  if (seconds < 60) return `${seconds} segundos`
  const mins = Math.ceil(seconds / 60)
  if (mins < 60) return `${mins} minuto${mins !== 1 ? 's' : ''}`
  const hours = Math.ceil(mins / 60)
  return `${hours} hora${hours !== 1 ? 's' : ''}`
}

export default function WizardPage() {
  const router = useRouter()
  const [state, setState] = useState<WizardState>({
    step: 1,
    profile: null,
    goals: [],
    style: null,
    isGenerating: false,
    error: null,
    isRateLimit: false,
    retryAfter: null,
  })

  const handleProfileNext = (profile: Profile) => {
    setState(s => ({ ...s, step: 2, profile }))
  }

  const handleGoalsNext = (goals: Goal[]) => {
    setState(s => ({ ...s, step: 3, goals }))
  }

  const handleStyleSubmit = async (style: CommunicationStyle) => {
    if (!state.profile) return

    const wizardData: WizardData = {
      profile: state.profile,
      goals: state.goals,
      style,
    }

    setState(s => ({ ...s, isGenerating: true, error: null, isRateLimit: false, retryAfter: null, style }))

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData),
      })

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}))
        setState(s => ({
          ...s,
          isGenerating: false,
          isRateLimit: true,
          retryAfter: data.retryAfter ?? null,
          error: null,
        }))
        return
      }

      if (!res.ok) {
        let errorMsg = 'No se pudo generar el plan. Por favor intenta de nuevo.'
        try {
          const data = await res.json()
          if (typeof data.error === 'string') errorMsg = data.error
        } catch { /* ignore */ }
        throw new Error(errorMsg)
      }

      const report: StrategyReport = await res.json()
      sessionStorage.setItem('creadorpro_report', JSON.stringify(report))
      sessionStorage.setItem('creadorpro_wizard', JSON.stringify(wizardData))
      router.push('/dashboard')
    } catch (err) {
      setState(s => ({
        ...s,
        isGenerating: false,
        error: err instanceof Error ? err.message : 'No se pudo generar el plan. Por favor intenta de nuevo.',
      }))
    }
  }

  const handleBack = () => {
    setState(s => ({ ...s, step: (s.step - 1) as WizardStep, error: null, isRateLimit: false }))
  }

  const progress = ((state.step - 1) / 2) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CP</span>
            </div>
            <span className="font-semibold text-foreground">CreadorPro AI</span>
          </Link>
          <span className="text-sm text-muted-foreground">Paso {state.step} de 3</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-border">
        <div
          className="h-1 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* Rate limit banner */}
          {state.isRateLimit && (
            <div className="mb-6 p-5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span className="font-semibold text-amber-400">Límite de generaciones alcanzado</span>
              </div>
              <p className="text-sm text-foreground">
                Los modelos de IA han alcanzado su límite de uso gratuito por hoy. Esto es normal durante períodos de alta demanda.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>
                  Tiempo estimado de espera:{' '}
                  <span className="text-foreground font-medium">{formatWaitTime(state.retryAfter)}</span>
                  {' '}— el límite se resetea automáticamente.
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Puedes volver más tarde e intentarlo de nuevo. Tus datos del formulario se mantendrán en esta sesión.
              </p>
            </div>
          )}

          {/* Generic error */}
          {state.error && (
            <div className="mb-6 p-4 rounded-lg border border-red-800 bg-red-950/50 text-red-400 text-sm">
              {state.error}
            </div>
          )}

          {state.step === 1 && (
            <StepProfile data={state.profile} onNext={handleProfileNext} />
          )}
          {state.step === 2 && (
            <StepGoals data={state.goals} onNext={handleGoalsNext} onBack={handleBack} />
          )}
          {state.step === 3 && (
            <StepStyle
              data={state.style}
              onSubmit={handleStyleSubmit}
              onBack={handleBack}
              isGenerating={state.isGenerating}
            />
          )}
        </div>
      </main>
    </div>
  )
}
