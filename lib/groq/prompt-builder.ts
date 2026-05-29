import type { WizardData } from '@/lib/types'

const STYLE_INSTRUCTIONS: Record<string, string> = {
  profesional: 'FORMAL y DIRECTO. Frases cortas. Lenguaje corporativo.',
  cercano: 'CONVERSACIONAL y EMPÁTICO. Usa "tú". Como amigo experto.',
  premium: 'EXCLUSIVO y SOFISTICADO. Alto valor, clientes de alto ticket.',
  creativo: 'INNOVADOR y FRESCO. Metáforas, ideas disruptivas.',
  autoridad: 'EXPERTO y CONTUNDENTE. Afirmaciones directas, sin condicionales.',
}

const GOAL_LABELS: Record<string, string> = {
  ganar_clientes: 'Conseguir nuevos clientes consistentemente',
  escalar_agencia: 'Escalar a micro-agencia con procesos replicables',
  servicios_premium: 'Vender servicios de alto valor (USD 500+)',
  marca_personal: 'Construir marca personal reconocida en LATAM',
  nicho_rentable: 'Dominar nicho con alta demanda y baja saturación',
}

const EXPERIENCE_CONTEXT: Record<string, string> = {
  junior: '0-2 años, construyendo portafolio',
  mid: '2-5 años, escalando ingresos',
  senior: '5-10 años, posicionándose como referente',
  expert: '+10 años, tarifas premium',
}

const SYSTEM_BASE = (style: string, styleInstructions: string, city: string) =>
  `Eres CreadorPro AI, consultor estratégico de negocios digitales para LATAM.
Tono: ${style.toUpperCase()} — ${styleInstructions}
REGLAS: responde en español, sé específico para ${city}, incluye números reales (USD, días, %), NUNCA escribas "No disponible", responde SOLO con el JSON solicitado sin markdown.`

export function buildPromptPart1(data: WizardData): { system: string; user: string } {
  const { profile, goals, style } = data
  const styleInstructions = STYLE_INSTRUCTIONS[style]
  const experienceContext = EXPERIENCE_CONTEXT[profile.experience]
  const goalsList = goals.map(g => GOAL_LABELS[g]).join(', ')

  const system = SYSTEM_BASE(style, styleInstructions, profile.country_city)

  const user = `Perfil: ${experienceContext} | Habilidades: ${profile.skills} | Servicios: ${profile.current_services} | Intereses: ${profile.interests} | Ciudad: ${profile.country_city} | Objetivos: ${goalsList}

Genera SOLO este JSON (sin markdown):
{
  "executive_summary": "3 oraciones específicas: habilidad más valiosa, nicho con más potencial en ${profile.country_city}, primera acción concreta esta semana",
  "top_3_opportunities": ["oportunidad 1 en ${profile.country_city} + acción esta semana", "oportunidad 2 + acción", "oportunidad 3 + acción"],
  "niches": [
    {"name": "nicho específico combinando ${profile.skills}", "difficulty": "bajo", "economic_potential": "USD X-Y/mes en ${profile.country_city}", "why": "por qué es rentable ahora para este perfil"},
    {"name": "segundo nicho", "difficulty": "medio", "economic_potential": "USD X-Y/mes", "why": "razón específica"},
    {"name": "tercer nicho", "difficulty": "alto", "economic_potential": "USD X-Y/mes", "why": "razón específica"}
  ],
  "value_proposition": "Ayudo a [cliente específico en ${profile.country_city}] a [resultado con número] en [tiempo] usando [método basado en ${profile.skills}]",
  "suggested_services": ["Servicio 1 — entregable concreto — USD X", "Servicio 2 — USD X", "Servicio 3 — USD X"],
  "pricing_suggestions": ["Entrada: USD X-Y — 3-4 entregables", "Estándar: USD X-Y — 5-6 entregables", "Premium: USD X-Y/mes — retainer con soporte"],
  "differentiators": ["diferenciador 1 basado en ${profile.skills} + frase para comunicarlo", "diferenciador 2 + frase", "diferenciador 3 + frase"],
  "competitive_positioning": "Qué hacen mal los competidores en ${profile.country_city}, qué puede hacer mejor este profesional, frase de posicionamiento",
  "acquisition_strategy": "1. acción concreta con herramienta y tiempo\\n2. acción\\n3. acción\\n4. acción con métrica",
  "prospecting_messages": ["LinkedIn para [cliente tipo]: mensaje 2-3 líneas sin spam", "WhatsApp/DM: mensaje 2 líneas", "Email: asunto + 4 líneas máximo"],
  "first_ideal_client": "Industria, cargo, problema, presupuesto USD, dónde encontrarlo en ${profile.country_city}, cómo contactarlo esta semana",
  "commercial_offer": "Nombre del paquete, 6 entregables, precio USD, tiempo de entrega, garantía",
  "pitch": "Problema→Solución→Resultado con número→CTA. 30 segundos.",
  "growth_roadmap": ["Mes 1-2: objetivo + 3 acciones + KPI", "Mes 3-4: objetivo + acciones + KPI", "Mes 5-6: objetivo + acciones + KPI", "Mes 7-12: escala + acciones + KPI"]
}`

  return { system, user }
}

export function buildPromptPart2(data: WizardData): { system: string; user: string } {
  const { profile, goals, style } = data
  const styleInstructions = STYLE_INSTRUCTIONS[style]
  const goalsList = goals.map(g => GOAL_LABELS[g]).join(', ')

  const system = SYSTEM_BASE(style, styleInstructions, profile.country_city)

  const user = `Perfil: ${profile.experience} | Habilidades: ${profile.skills} | Servicios: ${profile.current_services} | Ciudad: ${profile.country_city} | Objetivos: ${goalsList}

Genera SOLO este JSON (sin markdown):
{
  "seven_day_plan": ["Día 1 (lunes): acción específica con herramienta y tiempo estimado", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6 (sábado): contenido", "Día 7 (domingo): revisión"],
  "content_strategy": "3 pilares para ${profile.skills} en ${profile.country_city}: Pilar1 (tema, formato, frecuencia, por qué funciona en LATAM) | Pilar2 | Pilar3",
  "post_ideas": ["Post 1: formato — título exacto — hook primera línea", "Post 2", "Post 3", "Post 4", "Post 5"],
  "post_hooks": ["LinkedIn: primera línea que para el scroll sobre el nicho", "Instagram: caption de impacto", "Universal: pregunta provocadora del sector"],
  "first_30_days_content": ["Semana 1: tema + 3 posts específicos", "Semana 2: tema + 3 posts", "Semana 3: tema + 3 posts", "Semana 4: tema + 3 posts + CTA"],
  "linkedin_strategy": "1. Optimización perfil: qué cambiar exactamente\\n2. Contenido: tipo, frecuencia, horario para ${profile.country_city}\\n3. Networking: a quién conectar, mensaje, cuántos/día",
  "instagram_strategy": "1. Perfil: cambios en bio y highlights\\n2. Contenido: % reels/carruseles/stories + temas\\n3. Crecimiento: hashtags y táctica para ${profile.country_city}",
  "linkedin_bio": "Cargo específico | Resultado con número | CTA. Máx 3 líneas sin emojis.",
  "instagram_bio": "emoji quién eres\\nemoji a quién ayudas en ${profile.country_city}\\nemoji resultado con número\\nemoji CTA con link",
  "common_mistakes": ["Error 1 común en ${profile.country_city} para este nicho — cómo evitarlo", "Error 2 — solución", "Error 3 — solución"],
  "useful_tools": ["Nombre real — uso específico para ${profile.skills} — gratis: sí/no", "Nombre — uso — gratis: sí/no", "Nombre — uso — gratis: sí/no", "Nombre — uso — gratis: sí/no"],
  "swot": {
    "strengths": ["fortaleza específica de ${profile.skills}", "fortaleza de ${profile.current_services}", "fortaleza de conocimiento local"],
    "weaknesses": ["debilidad real del nivel ${profile.experience} — cómo mitigarla", "debilidad de visibilidad — solución", "debilidad de proceso — solución"],
    "opportunities": ["oportunidad concreta en ${profile.country_city} relacionada con ${profile.interests}", "nicho poco saturado", "tendencia LATAM 2024-2025"],
    "threats": ["amenaza real del mercado en ${profile.country_city}", "competencia o automatización para ${profile.skills}", "amenaza económica del sector"]
  },
  "ideal_clients": "Industria, tamaño, cargo decisor, problema con ${profile.skills}, presupuesto USD en ${profile.country_city}, dónde encontrarlos online y offline",
  "first_content": "Plataforma + formato + título + estructura (hook→desarrollo 3-5 puntos→CTA) + por qué generará tracción en ${profile.country_city}"
}`

  return { system, user }
}
