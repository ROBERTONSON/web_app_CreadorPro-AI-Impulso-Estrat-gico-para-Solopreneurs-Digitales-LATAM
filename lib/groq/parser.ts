import type { StrategyReport } from '@/lib/types'

const REQUIRED_KEYS: (keyof StrategyReport)[] = [
  'niches', 'value_proposition', 'suggested_services', 'content_strategy',
  'post_ideas', 'differentiators', 'acquisition_strategy', 'commercial_offer',
  'pitch', 'growth_roadmap', 'linkedin_strategy', 'instagram_strategy',
  'ideal_clients', 'competitive_positioning', 'first_content'
]

const ARRAY_KEYS = new Set([
  'niches', 'suggested_services', 'post_ideas', 'differentiators', 'growth_roadmap'
])

export function parseStrategyReport(raw: string): StrategyReport {
  let parsed: Record<string, unknown>

  try {
    parsed = JSON.parse(raw)
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON found in Groq response')
    parsed = JSON.parse(match[0])
  }

  for (const key of REQUIRED_KEYS) {
    if (!(key in parsed) || parsed[key] === null || parsed[key] === undefined) {
      parsed[key] = ARRAY_KEYS.has(key) ? [] : 'No disponible'
    }
  }

  return parsed as unknown as StrategyReport
}
