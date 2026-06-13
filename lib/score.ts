import type { NicheDetail, NicheDifficulty, Goal } from '@/lib/types'

// Extract the lower bound of USD range from strings like "USD 1,500-3,000/mes"
function extractMinUSD(potential: string): number {
  const match = potential.match(/USD\s*([\d,]+)/i)
  if (!match) return 0
  return parseInt(match[1].replace(/,/g, ''))
}

// Difficulty score: lower competition = higher score
const DIFFICULTY_SCORE: Record<NicheDifficulty, number> = {
  bajo: 40,
  medio: 25,
  alto: 10,
}

// Economic potential score (0-40 pts based on USD range)
function economicScore(potential: string): number {
  const min = extractMinUSD(potential)
  if (min >= 3000) return 40
  if (min >= 2000) return 32
  if (min >= 1000) return 24
  if (min >= 500) return 16
  return 8
}

// Goal alignment bonus (0-20 pts)
function goalBonus(goals: Goal[]): number {
  const bonusGoals: Goal[] = ['nicho_rentable', 'servicios_premium']
  const matches = goals.filter(g => bonusGoals.includes(g)).length
  return matches * 10
}

export interface NicheScore {
  total: number       // 0-100
  label: string
  color: string
  barColor: string
}

export function calculateNicheScore(niche: NicheDetail, goals: Goal[]): NicheScore {
  const raw = DIFFICULTY_SCORE[niche.difficulty] + economicScore(niche.economic_potential) + goalBonus(goals)
  const total = Math.min(100, raw)

  let label: string
  let color: string
  let barColor: string

  if (total >= 75) {
    label = 'Oportunidad alta'
    color = 'text-emerald-400'
    barColor = 'bg-emerald-500'
  } else if (total >= 50) {
    label = 'Oportunidad media'
    color = 'text-amber-400'
    barColor = 'bg-amber-500'
  } else {
    label = 'Oportunidad baja'
    color = 'text-red-400'
    barColor = 'bg-red-500'
  }

  return { total, label, color, barColor }
}
