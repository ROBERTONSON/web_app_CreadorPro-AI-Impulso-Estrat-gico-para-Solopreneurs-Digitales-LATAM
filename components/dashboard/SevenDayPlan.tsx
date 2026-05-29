import { Calendar } from 'lucide-react'

interface SevenDayPlanProps {
  plan: string[]
}

export default function SevenDayPlan({ plan }: SevenDayPlanProps) {
  return (
    <div className="space-y-3">
      {plan.map((action, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{i + 1}</span>
          </div>
          <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Día {i + 1}</span>
            </div>
            <p className="text-sm text-foreground">{action}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
