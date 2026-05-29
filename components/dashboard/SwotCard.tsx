import type { SwotAnalysis } from '@/lib/types'
import { Shield, AlertCircle, TrendingUp, Zap } from 'lucide-react'

interface SwotCardProps {
  swot: SwotAnalysis
}

const QUADRANTS = [
  {
    key: 'strengths' as keyof SwotAnalysis,
    label: 'Fortalezas',
    icon: Shield,
    color: 'border-emerald-500/30 bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  {
    key: 'weaknesses' as keyof SwotAnalysis,
    label: 'Debilidades',
    icon: AlertCircle,
    color: 'border-red-500/30 bg-red-500/10',
    iconColor: 'text-red-400',
    dotColor: 'bg-red-500',
  },
  {
    key: 'opportunities' as keyof SwotAnalysis,
    label: 'Oportunidades',
    icon: TrendingUp,
    color: 'border-blue-500/30 bg-blue-500/10',
    iconColor: 'text-blue-400',
    dotColor: 'bg-blue-500',
  },
  {
    key: 'threats' as keyof SwotAnalysis,
    label: 'Amenazas',
    icon: Zap,
    color: 'border-amber-500/30 bg-amber-500/10',
    iconColor: 'text-amber-400',
    dotColor: 'bg-amber-500',
  },
]

export default function SwotCard({ swot }: SwotCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {QUADRANTS.map(({ key, label, icon: Icon, color, iconColor, dotColor }) => (
        <div key={key} className={`rounded-xl border p-4 ${color}`}>
          <div className="flex items-center gap-2 mb-3">
            <Icon className={`h-4 w-4 ${iconColor}`} />
            <span className={`text-sm font-semibold ${iconColor}`}>{label}</span>
          </div>
          <ul className="space-y-1.5">
            {swot[key].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
