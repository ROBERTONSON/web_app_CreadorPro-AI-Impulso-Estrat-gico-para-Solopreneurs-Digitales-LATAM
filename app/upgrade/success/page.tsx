'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function UpgradeSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Give webhook time to process, then redirect to dashboard
    const t = setTimeout(() => router.push('/dashboard'), 4000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-white" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">¡Bienvenido a Premium!</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          Tu pago fue procesado correctamente. Activando tu plan Premium...
        </p>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Redirigiendo al dashboard...
      </div>
    </div>
  )
}
