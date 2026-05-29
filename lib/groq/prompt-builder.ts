import type { WizardData } from '@/lib/types'

const STYLE_INSTRUCTIONS: Record<string, string> = {
  profesional: 'Tono FORMAL y DIRECTO. Frases cortas. Lenguaje corporativo. Sin adornos ni emojis.',
  cercano: 'Tono CONVERSACIONAL y EMPÁTICO. Usa "tú". Como un amigo experto que conoce LATAM.',
  premium: 'Tono EXCLUSIVO y SOFISTICADO. Enfocado en alto valor y clientes de alto ticket.',
  creativo: 'Tono INNOVADOR y FRESCO. Usa metáforas. Ideas disruptivas. Referencias a tendencias.',
  autoridad: 'Tono EXPERTO y CONTUNDENTE. Afirmaciones directas. Sin condicionales débiles.',
}

const GOAL_LABELS: Record<string, string> = {
  ganar_clientes: 'Conseguir nuevos clientes de forma consistente',
  escalar_agencia: 'Escalar hacia una micro-agencia con procesos replicables',
  servicios_premium: 'Vender servicios de alto valor (USD 500+ por proyecto)',
  marca_personal: 'Construir marca personal reconocida en LATAM',
  nicho_rentable: 'Dominar un nicho con alta demanda y baja saturación',
}

const EXPERIENCE_CONTEXT: Record<string, string> = {
  junior: 'profesional con 0-2 años construyendo portafolio',
  mid: 'profesional con 2-5 años buscando escalar ingresos',
  senior: 'profesional con 5-10 años listo para posicionarse como referente',
  expert: 'experto con +10 años que puede cobrar tarifas premium',
}

export function buildPrompt(data: WizardData): { system: string; user: string } {
  const { profile, goals, style } = data
  const goalsList = goals.map(g => `- ${GOAL_LABELS[g]}`).join('\n')
  const styleInstructions = STYLE_INSTRUCTIONS[style]
  const experienceContext = EXPERIENCE_CONTEXT[profile.experience]

  const system = `Eres CreadorPro AI, consultor estratégico de negocios digitales para LATAM.
Generas planes estratégicos específicos y accionables, no genéricos.

REGLAS:
- Responde SIEMPRE en español
- Sé específico para ${profile.country_city} y LATAM
- Incluye números concretos (precios en USD, tiempos en días)
- Tono obligatorio: ${style.toUpperCase()} — ${styleInstructions}
- Responde ÚNICAMENTE con el JSON solicitado, sin markdown ni texto extra`

  const user = `Perfil: ${experienceContext}
Habilidades: ${profile.skills}
Servicios actuales: ${profile.current_services}
Intereses: ${profile.interests}
Ubicación: ${profile.country_city}
Objetivos:
${goalsList}

Genera un plan estratégico respondiendo SOLO con este JSON (sin markdown):

{
  "executive_summary": "3 oraciones sobre el potencial único de este profesional en ${profile.country_city}",
  "top_3_opportunities": ["oportunidad específica 1 con acción concreta", "oportunidad 2", "oportunidad 3"],
  "niches": [
    {"name": "nicho específico 1", "difficulty": "bajo", "economic_potential": "USD X-Y/mes", "why": "razón concreta en 1-2 oraciones"},
    {"name": "nicho 2", "difficulty": "medio", "economic_potential": "USD X-Y/mes", "why": "razón"},
    {"name": "nicho 3", "difficulty": "alto", "economic_potential": "USD X-Y/mes", "why": "razón"}
  ],
  "value_proposition": "Ayudo a [cliente] a [resultado con número] en [tiempo] usando [método]",
  "suggested_services": ["Servicio 1 — precio USD X", "Servicio 2 — precio USD X", "Servicio 3 — precio USD X"],
  "pricing_suggestions": ["Básico: USD X-Y — qué incluye", "Intermedio: USD X-Y — qué incluye", "Premium: USD X-Y/mes — qué incluye"],
  "differentiators": ["diferenciador 1 específico", "diferenciador 2", "diferenciador 3"],
  "competitive_positioning": "Cómo posicionarse frente a competidores en ${profile.country_city} en 2-3 oraciones concretas",
  "acquisition_strategy": "4 pasos numerados y concretos para conseguir clientes esta semana",
  "prospecting_messages": ["LinkedIn: mensaje de 2-3 líneas sin spam", "WhatsApp/DM: mensaje directo de 2 líneas", "Email: asunto + 3 líneas"],
  "first_ideal_client": "Descripción específica: industria, cargo, problema, dónde encontrarlo en ${profile.country_city}",
  "content_strategy": "3 pilares temáticos con frecuencia y formato para cada uno",
  "post_ideas": ["Post 1: formato — tema — hook", "Post 2", "Post 3", "Post 4", "Post 5"],
  "post_hooks": ["Hook LinkedIn: primera línea que para el scroll", "Hook Instagram: caption de impacto", "Hook universal: pregunta provocadora"],
  "first_30_days_content": ["Semana 1: tema + 3 tipos de contenido", "Semana 2", "Semana 3", "Semana 4 + CTA"],
  "linkedin_strategy": "3 pasos accionables: optimización perfil, tipo de contenido, táctica de networking",
  "instagram_strategy": "3 pasos: tipo de cuenta, mix de contenido, táctica de crecimiento orgánico",
  "linkedin_bio": "Bio LinkedIn 3 líneas: cargo | resultado que genera | CTA",
  "instagram_bio": "Bio Instagram 4 líneas con emojis: quién eres | a quién ayudas | resultado | CTA",
  "commercial_offer": "Nombre del paquete, 5 entregables, precio, tiempo de entrega, garantía",
  "pitch": "Pitch 30 segundos: Problema → Solución → Resultado → CTA",
  "growth_roadmap": ["Mes 1-2: objetivo + 3 acciones + métrica", "Mes 3-4", "Mes 5-6", "Mes 7-12"],
  "seven_day_plan": ["Día 1: acción específica con herramienta", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7"],
  "common_mistakes": ["Error 1 en este nicho — cómo evitarlo", "Error 2", "Error 3"],
  "useful_tools": ["Herramienta 1 — uso específico — gratis: sí/no", "Herramienta 2", "Herramienta 3", "Herramienta 4"],
  "swot": {
    "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
    "weaknesses": ["debilidad 1", "debilidad 2", "debilidad 3"],
    "opportunities": ["oportunidad de mercado 1 en ${profile.country_city}", "oportunidad 2", "oportunidad 3"],
    "threats": ["amenaza 1", "amenaza 2", "amenaza 3"]
  },
  "ideal_clients": "Perfil detallado: industria, tamaño, cargo decisor, presupuesto típico, dónde encontrarlos",
  "first_content": "Plataforma + formato + tema + estructura del post + por qué generará tracción"
}`

  return { system, user }
}
