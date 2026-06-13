'use client'

import { useState } from 'react'
import { Lock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PaywallModal from './PaywallModal'

interface PremiumLockProps {
  feature: string
}

export default function PremiumLock({ feature }: PremiumLockProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-950/50 border border-violet-800 flex items-center justify-center">
          <Lock className="h-5 w-5 text-violet-400" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">{feature} es Premium</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Actualizá tu plan para desbloquear esta funcionalidad y todas las demás herramientas avanzadas.
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white gap-2"
          size="sm"
        >
          <Zap className="h-3.5 w-3.5" />
          Desbloquear Premium
        </Button>
      </div>

      {showModal && (
        <PaywallModal
          reason="premium_feature"
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
