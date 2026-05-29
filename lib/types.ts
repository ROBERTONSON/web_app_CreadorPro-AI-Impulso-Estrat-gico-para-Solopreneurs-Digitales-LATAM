export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'expert'

export type Goal =
  | 'ganar_clientes'
  | 'escalar_agencia'
  | 'servicios_premium'
  | 'marca_personal'
  | 'nicho_rentable'

export type CommunicationStyle =
  | 'profesional'
  | 'cercano'
  | 'premium'
  | 'creativo'
  | 'autoridad'

export type NicheDifficulty = 'bajo' | 'medio' | 'alto'

export interface Profile {
  experience: ExperienceLevel
  skills: string
  current_services: string
  interests: string
  country_city: string
}

export interface WizardData {
  profile: Profile
  goals: Goal[]
  style: CommunicationStyle
}

export interface NicheDetail {
  name: string
  difficulty: NicheDifficulty
  economic_potential: string
  why: string
}

export interface SwotAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface StrategyReport {
  // Executive summary
  executive_summary: string
  top_3_opportunities: string[]

  // Niches (enhanced)
  niches: NicheDetail[]

  // Core strategy
  value_proposition: string
  suggested_services: string[]
  pricing_suggestions: string[]
  differentiators: string[]
  competitive_positioning: string

  // Acquisition
  acquisition_strategy: string
  prospecting_messages: string[]
  first_ideal_client: string

  // Content
  content_strategy: string
  post_ideas: string[]
  post_hooks: string[]
  first_30_days_content: string[]

  // Social
  linkedin_strategy: string
  instagram_strategy: string
  linkedin_bio: string
  instagram_bio: string

  // Business
  commercial_offer: string
  pitch: string
  growth_roadmap: string[]
  seven_day_plan: string[]
  common_mistakes: string[]
  useful_tools: string[]

  // Analysis
  swot: SwotAnalysis
  ideal_clients: string
  first_content: string
}
