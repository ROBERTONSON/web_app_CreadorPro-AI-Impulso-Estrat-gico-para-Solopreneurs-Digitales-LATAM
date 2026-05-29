'use client'

import { useState } from 'react'
import { Copy, Check, Link2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BioCardProps {
  linkedinBio: string
  instagramBio: string
}

export default function BioCard({ linkedinBio, instagramBio }: BioCardProps) {
  const [copiedLinkedin, setCopiedLinkedin] = useState(false)
  const [copiedInstagram, setCopiedInstagram] = useState(false)

  const copy = async (text: string, type: 'linkedin' | 'instagram') => {
    await navigator.clipboard.writeText(text)
    if (type === 'linkedin') {
      setCopiedLinkedin(true)
      setTimeout(() => setCopiedLinkedin(false), 2000)
    } else {
      setCopiedInstagram(true)
      setTimeout(() => setCopiedInstagram(false), 2000)
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* LinkedIn */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Link2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground">Bio LinkedIn</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copy(linkedinBio, 'linkedin')}
            className="h-7 px-2 text-xs"
          >
            {copiedLinkedin ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{linkedinBio}</p>
      </div>

      {/* Instagram */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
              <Camera className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground">Bio Instagram</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copy(instagramBio, 'instagram')}
            className="h-7 px-2 text-xs"
          >
            {copiedInstagram ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{instagramBio}</p>
      </div>
    </div>
  )
}
