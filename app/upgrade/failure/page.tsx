'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UpgradeFailurePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-950/50 border border-red-800 flex items-center justify-center">
        <XCircle className="h-8 w-8 text-red-400" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">El pago no se completó</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          Hubo un problema con tu pago. No se realizó ningún cargo. Podés intentarlo de nuevo.
        </p>
      </div>
      <Link href="/dashboard">
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          Volver al dashboard
        </Button>
      </Link>
    </div>
  )
}
