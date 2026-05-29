'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepProfile from '@/components/wizard/StepProfile'
import StepGoals from '@/components/wizard/StepGoals'
import StepStyle from '@/components/wizard/StepStyle'
import type { Profile, Goal, CommunicationStyle, WizardData, StrategyReport } from '@/lib/types'

type WizardStep = 1 | 2 | 3

interface WizardState {
  step: WizardStep
  profile: Profile | null
  goals: Goal[]
  style: CommunicationStyle | null
  isGenerating: boolean
  error: string | null
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

    setState(s => ({ ...s, isGenerating: true, error: null, style }))

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Error desconocido')
      }

      const report: StrategyReport = await res.json()

      // Guardar en sessionStorage para el dashboard
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
    setState(s => ({ ...s, step: (s.step - 1) as WizardStep, error: null }))
  }

  // Progress indicator
  const progress = ((state.step - 1) / 2) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CP</span>
            </div>
            <span className="font-semibold text-foreground">CreadorPro AI</span>
          </div>
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
          {state.error && (
            <div className="mb-6 p-4 rounded-lg border border-red-800 bg-red-950/50 text-red-400 text-sm">
              {state.error}
            </div>
          )}

          {state.step === 1 && (
            <StepProfile
              data={state.profile}
              onNext={handleProfileNext}
            />
          )}
          {state.step === 2 && (
            <StepGoals
              data={state.goals}
              onNext={handleGoalsNext}
              onBack={handleBack}
            />
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
