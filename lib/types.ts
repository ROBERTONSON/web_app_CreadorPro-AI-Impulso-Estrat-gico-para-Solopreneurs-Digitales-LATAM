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

export interface StrategyReport {
  niches: string[]
  value_proposition: string
  suggested_services: string[]
  content_strategy: string
  post_ideas: string[]
  differentiators: string[]
  acquisition_strategy: string
  commercial_offer: string
  pitch: string
  growth_roadmap: string[]
  linkedin_strategy: string
  instagram_strategy: string
  ideal_clients: string
  competitive_positioning: string
  first_content: string
}
