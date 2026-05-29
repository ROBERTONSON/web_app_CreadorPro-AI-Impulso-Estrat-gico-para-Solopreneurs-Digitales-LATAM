import type { StrategyReport } from '@/lib/types'
import { Target, Briefcase, PenSquare, Calendar } from 'lucide-react'

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
    {
      label: 'Acciones esta semana',
      value: report.seven_day_plan.length,
      icon: Calendar,
      color: 'from-emerald-600 to-teal-600',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Tu Plan Estratégico</h1>
      <p className="text-muted-foreground mb-6">Generado por CreadorPro AI — personalizado para tu perfil LATAM</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground leading-tight">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
