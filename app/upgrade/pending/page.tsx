'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UpgradePendingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-950/50 border border-amber-800 flex items-center justify-center">
        <Clock className="h-8 w-8 text-amber-400" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Pago pendiente</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          Tu pago está siendo procesado. Cuando se confirme, tu plan Premium se activará automáticamente.
        </p>
      </div>
      <Link href="/dashboard">
        <Button variant="outline">Volver al dashboard</Button>
      </Link>
    </div>
  )
}
