import type { StrategyReport } from '@/lib/types'
import { Target, Briefcase, PenSquare } from 'lucide-react'

interface MetricsSummaryProps {
  report: StrategyReport
}

export default function MetricsSummary({ report }: MetricsSummaryProps) {
  const metrics = [
    {
      label: 'Nichos identificados',
      value: report.niches.length,
      icon: Target,
      color: 'from-violet-600 to-indigo-600',
    },
    {
      label: 'Servicios sugeridos',
      value: report.suggested_services.length,
      icon: Briefcase,
      color: 'from-indigo-600 to-blue-600',
    },
    {
      label: 'Ideas de contenido',
      value: report.post_ideas.length,
      icon: PenSquare,
      color: 'from-blue-600 to-cyan-600',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Tu Plan Estratégico</h1>
      <p className="text-muted-foreground mb-6">Generado por CreadorPro AI — personalizado para tu perfil LATAM</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
