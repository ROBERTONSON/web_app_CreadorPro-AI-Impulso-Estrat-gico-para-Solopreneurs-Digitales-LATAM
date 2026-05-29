'use client'

import { useState } from 'react'
import { LucideIcon, Copy, Check, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReportCardProps {
  id: string
  title: string
  icon: LucideIcon
  content: string | string[]
  onRegenerate?: () => Promise<void>
}

export default function ReportCard({ id, title, icon: Icon, content, onRegenerate }: ReportCardProps) {
  const isArray = Array.isArray(content)
  const [copied, setCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const textContent = isArray ? (content as string[]).join('\n') : (content as string)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = async () => {
    if (!onRegenerate) return
    setIsRegenerating(true)
    try {
      await onRegenerate()
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div id={id} className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-20">
      {/* Card header */}
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-gradient-to-r from-violet-950/20 to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
          <h2 className="font-semibold text-foreground text-sm">{title}</h2>
        </div>
        <div className="flex items-center gap-1">
          {onRegenerate && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              title="Regenerar esta sección"
            >
              {isRegenerating
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <RefreshCw className="h-3 w-3" />
              }
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            title="Copiar sección"
          >
            {copied
              ? <Check className="h-3 w-3 text-emerald-400" />
              : <Copy className="h-3 w-3" />
            }
          </Button>
        </div>
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
