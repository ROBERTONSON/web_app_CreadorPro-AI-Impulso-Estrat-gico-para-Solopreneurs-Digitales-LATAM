import type { StrategyReport, NicheDetail, SwotAnalysis } from '@/lib/types'

function safeParse(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw)
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return {}
    try {
      return JSON.parse(match[0])
    } catch {
      const cleaned = match[0].replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
      try { return JSON.parse(cleaned) } catch { return {} }
    }
  }
}

function str(val: unknown, fallback = ''): string {
  if (typeof val === 'string' && val.trim() && val.trim() !== 'No disponible') {
    return val.trim()
  }
  return fallback
}

function arr(val: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(val) && val.length > 0) return val as string[]
  return fallback
}

function normalizeNiches(val: unknown): NicheDetail[] {
  if (!Array.isArray(val) || val.length === 0) {
    return [
      { name: 'Nicho pendiente', difficulty: 'medio', economic_potential: 'USD 1,000-2,000/mes', why: '' },
    ]
  }
  return (val as unknown[]).map((n) => {
    if (typeof n === 'string') {
      return { name: n, difficulty: 'medio' as const, economic_potential: '', why: '' }
    }
    const niche = n as Partial<NicheDetail>
    return {
      name: str(niche.name, 'Nicho'),
      difficulty: (['bajo', 'medio', 'alto'].includes(niche.difficulty ?? '') ? niche.difficulty : 'medio') as NicheDetail['difficulty'],
      economic_potential: str(niche.economic_potential, ''),
      why: str(niche.why, ''),
    }
  })
}

function normalizeSwot(val: unknown): SwotAnalysis {
  const empty = { strengths: [], weaknesses: [], opportunities: [], threats: [] }
  if (!val || typeof val !== 'object') return empty
  const s = val as Partial<SwotAnalysis>
  return {
    strengths: arr(s.strengths),
    weaknesses: arr(s.weaknesses),
    opportunities: arr(s.opportunities),
    threats: arr(s.threats),
  }
}

export function parseStrategyReport(raw1: string, raw2: string): StrategyReport {
  const p1 = safeParse(raw1)
  const p2 = safeParse(raw2)

  return {
    // Part 1 — Strategy core
    executive_summary: str(p1.executive_summary),
    top_3_opportunities: arr(p1.top_3_opportunities as unknown[]),
    niches: normalizeNiches(p1.niches),
    value_proposition: str(p1.value_proposition),
    suggested_services: arr(p1.suggested_services as unknown[]),
    pricing_suggestions: arr(p1.pricing_suggestions as unknown[]),
    differentiators: arr(p1.differentiators as unknown[]),
    competitive_positioning: str(p1.competitive_positioning),
    acquisition_strategy: str(p1.acquisition_strategy),
    prospecting_messages: arr(p1.prospecting_messages as unknown[]),
    first_ideal_client: str(p1.first_ideal_client),
    commercial_offer: str(p1.commercial_offer),
    pitch: str(p1.pitch),
    growth_roadmap: arr(p1.growth_roadmap as unknown[]),

    // Part 2 — Content & tactics
    seven_day_plan: arr(p2.seven_day_plan as unknown[]),
    content_strategy: str(p2.content_strategy),
    post_ideas: arr(p2.post_ideas as unknown[]),
    post_hooks: arr(p2.post_hooks as unknown[]),
    first_30_days_content: arr(p2.first_30_days_content as unknown[]),
    linkedin_strategy: str(p2.linkedin_strategy),
    instagram_strategy: str(p2.instagram_strategy),
    linkedin_bio: str(p2.linkedin_bio),
    instagram_bio: str(p2.instagram_bio),
    common_mistakes: arr(p2.common_mistakes as unknown[]),
    useful_tools: arr(p2.useful_tools as unknown[]),
    swot: normalizeSwot(p2.swot),
    ideal_clients: str(p2.ideal_clients),
    first_content: str(p2.first_content),
  }
}
