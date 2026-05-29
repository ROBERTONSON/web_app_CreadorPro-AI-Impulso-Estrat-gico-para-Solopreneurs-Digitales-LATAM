import type { WizardData } from '@/lib/types'

const STYLE_DESCRIPTIONS: Record<string, string> = {
  profesional: 'Formal, directo, orientado a resultados, lenguaje corporativo',
  cercano: 'Conversacional, empático, como hablar con un amigo experto',
  premium: 'Exclusivo, sofisticado, enfocado en alto valor y resultados excepcionales',
  creativo: 'Innovador, fresco, con metáforas y lenguaje inspirador',
  autoridad: 'Experto, contundente, basado en datos y experiencia comprobada',
}

const GOAL_LABELS: Record<string, string> = {
  ganar_clientes: 'Conseguir nuevos clientes de forma consistente',
  escalar_agencia: 'Escalar hacia una micro-agencia o equipo',
  servicios_premium: 'Vender servicios de alto valor (premium)',
  marca_personal: 'Construir y posicionar una marca personal sólida',
  nicho_rentable: 'Identificar y dominar un nicho de mercado rentable',
}

export function buildPrompt(data: WizardData): { system: string; user: string } {
  const { profile, goals, style } = data
  const goalsList = goals.map(g => `- ${GOAL_LABELS[g]}`).join('\n')
  const styleDesc = STYLE_DESCRIPTIONS[style]

  const system = `Eres CreadorPro AI, un consultor estratégico especializado en negocios digitales para el mercado latinoamericano (LATAM).

Tu rol es analizar el perfil de un profesional digital y generar un plan estratégico completo, accionable y contextualizado para LATAM.

REGLAS:
- Responde SIEMPRE en español
- Usa terminología relevante al mercado digital latinoamericano
- Sé específico y accionable, no genérico
- Adapta el tono según el estilo de comunicación indicado
- Responde ÚNICAMENTE con el JSON estructurado solicitado, sin texto adicional ni markdown`

  const user = `Analiza el siguiente perfil de un profesional digital de LATAM y genera un plan estratégico completo.

## PERFIL DEL PROFESIONAL
- Nivel de experiencia: ${profile.experience}
- Habilidades principales: ${profile.skills}
- Servicios actuales: ${profile.current_services}
- Intereses de negocio: ${profile.interests}
- Ubicación: ${profile.country_city}

## OBJETIVOS DE NEGOCIO
${goalsList}

## ESTILO DE COMUNICACIÓN
${style} — ${styleDesc}

## INSTRUCCIÓN
Genera un plan estratégico completo respondiendo ÚNICAMENTE con el siguiente JSON (sin markdown, sin texto extra):

{
  "niches": ["string", "string", "string"],
  "value_proposition": "string",
  "suggested_services": ["string", "string", "string"],
  "content_strategy": "string",
  "post_ideas": ["string", "string", "string", "string", "string"],
  "differentiators": ["string", "string", "string"],
  "acquisition_strategy": "string",
  "commercial_offer": "string",
  "pitch": "string",
  "growth_roadmap": ["string", "string", "string", "string"],
  "linkedin_strategy": "string",
  "instagram_strategy": "string",
  "ideal_clients": "string",
  "competitive_positioning": "string",
  "first_content": "string"
}

IMPORTANTE:
- Cada campo debe tener contenido específico y accionable para ${profile.country_city}
- Los arrays deben tener entre 3 y 5 elementos
- Los campos de texto deben tener entre 100 y 300 palabras
- Adapta TODO el contenido al estilo de comunicación: ${style}`

  return { system, user }
}
