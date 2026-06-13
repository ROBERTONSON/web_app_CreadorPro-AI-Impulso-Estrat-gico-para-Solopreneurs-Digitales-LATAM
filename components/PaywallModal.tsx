'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Zap, Check, X } from 'lucide-react'

interface PaywallModalProps {
  reason: 'generation_limit' | 'premium_feature'
  generationsUsed?: number
  onClose?: () => void
}

const PREMIUM_FEATURES = [
  '90 generaciones de planes por mes',
  'Historial completo de planes guardados',
  'Buyer Persona generado por IA',
  'Business Model Canvas automático',
  'Generador de nombres de marca y eslogan',
  'Calculadora de ingresos potenciales',
  'Acceso prioritario a nuevas funcionalidades',
]

export default function PaywallModal({ reason, generationsUsed = 3, onClose }: PaywallModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      if (!res.ok) throw new Error()
      const { init_point } = await res.json()
      window.location.href = init_point
    } catch {
      setError('No se pudo iniciar el pago. Intentá de nuevo.')
      setIsLoading(false)
    }
  }

  const title = reason === 'generation_limit'
    ? 'Alcanzaste tu límite mensual'
    : 'Funcionalidad Premium'

  const description = reason === 'generation_limit'
    ? `Usaste tus 3 generaciones gratuitas de este mes. Actualizá a Premium para generar planes ilimitados.`
    : 'Esta funcionalidad está disponible para usuarios Premium. Actualizá tu plan para acceder.'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Header gradient */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-violet-950/60 to-indigo-950/60">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-lg">{title}</h2>
                <p className="text-xs text-violet-300">CreadorPro AI Premium</p>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-3">{description}</p>

          {reason === 'generation_limit' && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-xs text-red-400 font-medium">{generationsUsed}/3 usados</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-foreground">USD 9.99</span>
            <span className="text-sm text-muted-foreground">/mes</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-emerald-400 font-medium">Cancelá cuando quieras</p>
            <p className="text-xs text-muted-foreground">Modo de prueba activo</p>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 py-4">
          <ul className="space-y-2">
            {PREMIUM_FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 space-y-2">
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-base"
          >
            {isLoading
              ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Redirigiendo a Mercado Pago...</>
              : <><Zap className="h-4 w-4 mr-2" />Actualizar a Premium</>
            }
          </Button>
          {!onClose && (
            <p className="text-xs text-muted-foreground text-center">
              El límite se reinicia el 1 de cada mes
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
