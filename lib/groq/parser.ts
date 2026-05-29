import type { StrategyReport, NicheDetail, SwotAnalysis } from '@/lib/types'

const STRING_KEYS: (keyof StrategyReport)[] = [
  'executive_summary', 'value_proposition', 'competitive_positioning',
  'acquisition_strategy', 'first_ideal_client', 'content_strategy',
  'linkedin_strategy', 'instagram_strategy', 'linkedin_bio', 'instagram_bio',
  'commercial_offer', 'pitch', 'ideal_clients', 'first_content',
]

const ARRAY_KEYS: (keyof StrategyReport)[] = [
  'top_3_opportunities', 'suggested_services', 'pricing_suggestions',
  'differentiators', 'prospecting_messages', 'post_ideas', 'post_hooks',
  'first_30_days_content', 'growth_roadmap', 'seven_day_plan',
  'common_mistakes', 'useful_tools',
]

const DEFAULT_NICHE: NicheDetail = {
  name: 'No disponible',
  difficulty: 'medio',
  economic_potential: 'No disponible',
  why: 'No disponible',
}

const DEFAULT_SWOT: SwotAnalysis = {
  strengths: [],
  weaknesses: [],
  opportunities: [],
  threats: [],
}

export function parseStrategyReport(raw: string): StrategyReport {
  let parsed: Record<string, unknown>

  try {
    parsed = JSON.parse(raw)
  } catch {
    // Try to extract JSON block
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON found in Groq response')
    try {
      parsed = JSON.parse(match[0])
    } catch {
      // Last resort: try to fix common JSON issues
      const cleaned = match[0]
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
      parsed = JSON.parse(cleaned)
    }
  }

  // Normalize string fields
  for (const key of STRING_KEYS) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      parsed[key] = 'No disponible'
    }
  }

  // Normalize array fields
  for (const key of ARRAY_KEYS) {
    if (!Array.isArray(parsed[key])) {
      parsed[key] = []
    }
  }

  // Normalize niches
  if (!Array.isArray(parsed.niches) || parsed.niches.length === 0) {
    parsed.niches = [DEFAULT_NICHE, DEFAULT_NICHE, DEFAULT_NICHE]
  } else {
    parsed.niches = (parsed.niches as unknown[]).map((n) => {
      if (typeof n === 'string') {
        return { name: n, difficulty: 'medio', economic_potential: 'No disponible', why: '' }
      }
      const niche = n as Partial<NicheDetail>
      return {
        name: niche.name ?? 'No disponible',
        difficulty: niche.difficulty ?? 'medio',
        economic_potential: niche.economic_potential ?? 'No disponible',
        why: niche.why ?? '',
      }
    })
  }

  // Normalize swot
  if (!parsed.swot || typeof parsed.swot !== 'object') {
    parsed.swot = DEFAULT_SWOT
  } else {
    const swot = parsed.swot as Partial<SwotAnalysis>
    parsed.swot = {
      strengths: Array.isArray(swot.strengths) ? swot.strengths : [],
      weaknesses: Array.isArray(swot.weaknesses) ? swot.weaknesses : [],
      opportunities: Array.isArray(swot.opportunities) ? swot.opportunities : [],
      threats: Array.isArray(swot.threats) ? swot.threats : [],
    }
  }

  return parsed as unknown as StrategyReport
}
