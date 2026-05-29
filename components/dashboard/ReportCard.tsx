import { LucideIcon } from 'lucide-react'

interface ReportCardProps {
  id: string
  title: string
  icon: LucideIcon
  content: string | string[]
}

export default function ReportCard({ id, title, icon: Icon, content }: ReportCardProps) {
  const isArray = Array.isArray(content)

  return (
    <div id={id} className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-20">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-3 bg-gradient-to-r from-violet-950/20 to-indigo-950/20">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>

      {/* Card content */}
      <div className="px-5 py-4">
        {isArray ? (
          <ul className="space-y-2">
            {(content as string[]).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content as string}</p>
        )}
      </div>
    </div>
  )
}
