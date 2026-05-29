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

// Frases prohibidas que el modelo tiende a usar como relleno
const FORBIDDEN_PHRASES = `
FRASES PROHIBIDAS (nunca uses estas):
- "es importante que"
- "debes considerar"  
- "en el mundo digital"
- "en la era digital"
- "No disponible"
- "es fundamental"
- "hay que tener en cuenta"
- "se recomienda"
- "podría ser"
- "tal vez"
- "quizás"
- "en general"
- "entre otros"
- "y mucho más"
Si no tienes información suficiente para un campo, INVENTA una respuesta específica y realista basada en el perfil. NUNCA escribas "No disponible".`

const SYSTEM_BASE = (style: string, styleInstructions: string, city: string) => `Eres CreadorPro AI, consultor estratégico de negocios digitales para LATAM.
Generas planes 100% específicos para el perfil dado. CERO respuestas genéricas.

REGLAS ABSOLUTAS:
1. Responde SIEMPRE en español
2. Cada respuesta DEBE mencionar datos concretos del perfil (habilidades, ciudad, servicios)
3. Incluye números reales: precios en USD, porcentajes, días, cantidades
4. Contextualiza TODO para ${city} y el mercado LATAM 2024-2025
5. Tono obligatorio: ${style.toUpperCase()} — ${styleInstructions}
6. Responde ÚNICAMENTE con el JSON solicitado, sin markdown ni texto extra
${FORBIDDEN_PHRASES}`

export function buildPromptPart1(data: WizardData): { system: string; user: string } {
  const { profile, goals, style } = data
  const styleInstructions = STYLE_INSTRUCTIONS[style]
  const experienceContext = EXPERIENCE_CONTEXT[profile.experience]

  const system = SYSTEM_BASE(style, styleInstructions, profile.country_city)

  const user = `PERFIL:
- Tipo: ${experienceContext}
- Habilidades: ${profile.skills}
- Servicios actuales: ${profile.current_services}
- Intereses: ${profile.interests}
- Ciudad: ${profile.country_city}
- Objetivos: ${goals.map(g => GOAL_LABELS[g]).join(', ')}

PARTE 1 — ESTRATEGIA CORE. Responde SOLO con este JSON:

{
  "executive_summary": "3 oraciones específicas sobre ${profile.country_city}. Menciona: (1) la habilidad más valiosa de este profesional, (2) el nicho con más potencial dado su perfil, (3) la primera acción concreta a tomar esta semana. Ejemplo de calidad: 'Tu experiencia en [habilidad específica] te posiciona para dominar el nicho de [nicho concreto] en ${profile.country_city}, donde la demanda supera la oferta. El mercado local de [sector] está creciendo y pocos profesionales combinan [habilidad1] con [habilidad2]. Esta semana: contacta 5 empresas de [sector] en LinkedIn con el mensaje de prospección de esta guía.'",

  "top_3_opportunities": [
    "Oportunidad 1: [nombre específico del nicho] en ${profile.country_city} — Por qué ahora: [razón concreta del mercado local] — Acción esta semana: [paso específico con herramienta]",
    "Oportunidad 2: [nombre específico] — Por qué ahora: [razón] — Acción: [paso]",
    "Oportunidad 3: [nombre específico] — Por qué ahora: [razón] — Acción: [paso]"
  ],

  "niches": [
    {
      "name": "Nicho ultra-específico que combine las habilidades '${profile.skills}' con un sector concreto en ${profile.country_city}",
      "difficulty": "bajo",
      "economic_potential": "USD X.XXX-X.XXX/mes (basado en tarifas reales de ${profile.country_city})",
      "why": "2 oraciones específicas: por qué este nicho es rentable AHORA en ${profile.country_city} y por qué este profesional tiene ventaja sobre la competencia local"
    },
    {
      "name": "Segundo nicho específico diferente al primero",
      "difficulty": "medio",
      "economic_potential": "USD X.XXX-X.XXX/mes",
      "why": "2 oraciones específicas con datos del mercado local"
    },
    {
      "name": "Tercer nicho con mayor potencial de escala",
      "difficulty": "alto",
      "economic_potential": "USD X.XXX-X.XXX/mes",
      "why": "2 oraciones específicas"
    }
  ],

  "value_proposition": "Formato exacto: 'Ayudo a [tipo específico de cliente en ${profile.country_city}] a [resultado medible con número] en [tiempo concreto] usando [método único basado en ${profile.skills}]'. Ejemplo: 'Ayudo a restaurantes en ${profile.country_city} a aumentar sus reservas online en un 40% en 60 días usando estrategias de contenido visual y gestión de reseñas en Google.'",

  "suggested_services": [
    "Servicio 1: [nombre específico basado en ${profile.skills}] — [descripción de 1 línea con entregable concreto] — USD [precio realista para ${profile.country_city}]",
    "Servicio 2: [nombre específico] — [descripción] — USD [precio]",
    "Servicio 3: [nombre específico] — [descripción] — USD [precio]"
  ],

  "pricing_suggestions": [
    "Entrada: USD [X]-[Y] — [qué incluye exactamente, 3-4 entregables concretos]",
    "Estándar: USD [X]-[Y] — [qué incluye, 5-6 entregables]",
    "Premium/Retainer: USD [X]-[Y]/mes — [qué incluye, con horas de soporte y entregables mensuales]"
  ],

  "differentiators": [
    "Diferenciador 1: [qué hace único a este profesional basado en ${profile.skills}] — Cómo comunicarlo: '[frase exacta para usar en LinkedIn/Instagram]'",
    "Diferenciador 2: [diferenciador basado en experiencia o nicho] — Cómo comunicarlo: '[frase exacta]'",
    "Diferenciador 3: [diferenciador basado en resultados o metodología] — Cómo comunicarlo: '[frase exacta]'"
  ],

  "competitive_positioning": "3 oraciones concretas: (1) Qué hacen mal los competidores en ${profile.country_city} que ofrecen servicios similares a ${profile.current_services}. (2) Qué puede hacer mejor este profesional específicamente. (3) Cómo comunicar esa ventaja en una frase de posicionamiento.",

  "acquisition_strategy": "4 pasos numerados y específicos:\\n1. [Acción concreta con herramienta específica y tiempo estimado]\\n2. [Acción concreta]\\n3. [Acción concreta]\\n4. [Acción concreta con métrica de éxito]",

  "prospecting_messages": [
    "LinkedIn (para [tipo de cliente específico]): '[mensaje de 2-3 líneas personalizable, sin sonar a spam, que mencione un problema real del sector]'",
    "WhatsApp/DM (para referidos): '[mensaje directo de 2 líneas que genere curiosidad]'",
    "Email frío (asunto + cuerpo): 'Asunto: [asunto específico que genere apertura] | Cuerpo: [4 líneas máximo con problema, solución y CTA]'"
  ],

  "first_ideal_client": "Descripción ultra-específica: Industria [X] en ${profile.country_city}, empresa de [tamaño], cargo del decisor [Y], problema principal [Z que se relaciona con ${profile.skills}], presupuesto típico USD [rango], dónde encontrarlo: [plataforma + grupo/comunidad específica en ${profile.country_city}], cómo contactarlo esta semana: [acción concreta].",

  "commercial_offer": "Nombre del paquete: '[nombre atractivo]'. Incluye: [6-7 entregables específicos basados en ${profile.skills}]. Precio: USD [X]. Tiempo de entrega: [X días]. Garantía: [garantía específica]. Cómo presentarla: [canal y formato concreto].",

  "pitch": "Pitch de 30 segundos en formato Problema→Solución→Resultado→CTA:\\n'[Problema específico que tienen los clientes en ${profile.country_city}]. [Solución basada en ${profile.skills}]. [Resultado con número concreto]. [CTA directo].'",

  "growth_roadmap": [
    "Mes 1-2: Objetivo [específico con número] — Acciones: (1) [acción] (2) [acción] (3) [acción] — Métrica: [KPI concreto]",
    "Mes 3-4: Objetivo [específico] — Acciones: (1) [acción] (2) [acción] (3) [acción] — Métrica: [KPI]",
    "Mes 5-6: Objetivo [específico] — Acciones: (1) [acción] (2) [acción] (3) [acción] — Métrica: [KPI]",
    "Mes 7-12: Objetivo de escala [específico] — Acciones: (1) [acción] (2) [acción] (3) [acción] — Métrica: [KPI]"
  ]
}`

  return { system, user }
}

export function buildPromptPart2(data: WizardData): { system: string; user: string } {
  const { profile, goals, style } = data
  const styleInstructions = STYLE_INSTRUCTIONS[style]
  const experienceContext = EXPERIENCE_CONTEXT[profile.experience]

  const system = SYSTEM_BASE(style, styleInstructions, profile.country_city)

  const user = `PERFIL:
- Tipo: ${experienceContext}
- Habilidades: ${profile.skills}
- Servicios actuales: ${profile.current_services}
- Intereses: ${profile.interests}
- Ciudad: ${profile.country_city}
- Objetivos: ${goals.map(g => GOAL_LABELS[g]).join(', ')}

PARTE 2 — CONTENIDO, TÁCTICAS Y ANÁLISIS. Responde SOLO con este JSON:

{
  "seven_day_plan": [
    "Día 1 (lunes): [acción específica con herramienta real y tiempo estimado, ej: 'Optimiza tu perfil de LinkedIn en 45 min: cambia el titular a [frase específica], agrega 3 proyectos de ${profile.current_services} con resultados medibles']",
    "Día 2 (martes): [acción específica]",
    "Día 3 (miércoles): [acción específica]",
    "Día 4 (jueves): [acción específica]",
    "Día 5 (viernes): [acción específica]",
    "Día 6 (sábado): [acción de contenido específica]",
    "Día 7 (domingo): [revisión y planificación específica]"
  ],

  "content_strategy": "3 pilares temáticos específicos para ${profile.skills} en ${profile.country_city}:\\nPilar 1: [tema] — Formato: [tipo de contenido] — Frecuencia: [X veces/semana] — Por qué funciona en LATAM: [razón concreta]\\nPilar 2: [tema] — Formato: [tipo] — Frecuencia: [X] — Por qué funciona: [razón]\\nPilar 3: [tema] — Formato: [tipo] — Frecuencia: [X] — Por qué funciona: [razón]",

  "post_ideas": [
    "Post 1: [formato: carrusel/video/texto] — '[título exacto del post relacionado con ${profile.skills}]' — Hook: '[primera línea que para el scroll]'",
    "Post 2: [formato] — '[título exacto]' — Hook: '[primera línea]'",
    "Post 3: [formato] — '[título exacto]' — Hook: '[primera línea]'",
    "Post 4: [formato] — '[título exacto]' — Hook: '[primera línea]'",
    "Post 5: [formato] — '[título exacto]' — Hook: '[primera línea]'"
  ],

  "post_hooks": [
    "Hook LinkedIn (para profesionales de ${profile.country_city}): '[primera línea específica sobre un problema real del nicho que para el scroll, máx 15 palabras]'",
    "Hook Instagram (para potenciales clientes): '[caption de impacto con dato o pregunta provocadora relacionada a ${profile.skills}]'",
    "Hook universal (funciona en cualquier plataforma): '[afirmación contraintuitiva o pregunta que genere debate en el sector]'"
  ],

  "first_30_days_content": [
    "Semana 1 — Tema: [tema de presentación/autoridad basado en ${profile.skills}] — Publicar: (1) [post específico] (2) [post específico] (3) [post específico]",
    "Semana 2 — Tema: [tema de valor/educación] — Publicar: (1) [post] (2) [post] (3) [post]",
    "Semana 3 — Tema: [tema de casos/resultados] — Publicar: (1) [post] (2) [post] (3) [post]",
    "Semana 4 — Tema: [tema de oferta/CTA] — Publicar: (1) [post] (2) [post] (3) [post con CTA directo a servicios]"
  ],

  "linkedin_strategy": "3 pasos accionables esta semana:\\n1. Optimización del perfil: [qué cambiar exactamente en titular, about y experiencia para el nicho de ${profile.skills}]\\n2. Contenido: [tipo de post, frecuencia y horario óptimo para ${profile.country_city}]\\n3. Networking: [a quién conectar exactamente, con qué mensaje, cuántos por día]",

  "instagram_strategy": "3 pasos accionables:\\n1. Perfil: [qué cambiar en bio, foto, highlights para el nicho de ${profile.skills}]\\n2. Contenido: [mix exacto: X% reels, X% carruseles, X% stories — temas específicos para cada formato]\\n3. Crecimiento: [táctica específica de hashtags, colaboraciones o engagement para ${profile.country_city}]",

  "linkedin_bio": "[Cargo específico basado en ${profile.skills}] | [Resultado concreto que genera con número] | [CTA con dato de contacto o link]. Máx 3 líneas. Sin emojis.",

  "instagram_bio": "[Emoji] [Quién eres en 5 palabras basado en ${profile.skills}]\\n[Emoji] [A quién ayudas específicamente en ${profile.country_city}]\\n[Emoji] [Resultado concreto con número]\\n[Emoji] [CTA con link o acción]",

  "common_mistakes": [
    "Error 1 (muy común en ${profile.country_city} para ${profile.skills}): [error específico del nicho] — Cómo evitarlo: [acción concreta]",
    "Error 2: [error específico] — Cómo evitarlo: [acción]",
    "Error 3: [error específico] — Cómo evitarlo: [acción]"
  ],

  "useful_tools": [
    "[Nombre real de herramienta] — Para qué usarla: [uso específico para ${profile.skills}] — Plan gratuito: sí/no — Link: [dominio]",
    "[Nombre real] — Uso: [específico] — Gratis: sí/no — Link: [dominio]",
    "[Nombre real] — Uso: [específico] — Gratis: sí/no — Link: [dominio]",
    "[Nombre real] — Uso: [específico] — Gratis: sí/no — Link: [dominio]"
  ],

  "swot": {
    "strengths": [
      "Fortaleza específica basada en '${profile.skills}' que pocos competidores en ${profile.country_city} tienen",
      "Fortaleza basada en '${profile.current_services}' y experiencia acumulada",
      "Fortaleza basada en conocimiento del mercado local o intereses en '${profile.interests}'"
    ],
    "weaknesses": [
      "Debilidad real a trabajar dado el nivel '${profile.experience}' — cómo mitigarla",
      "Debilidad de posicionamiento o visibilidad actual — cómo mejorarla",
      "Debilidad de proceso o capacidad — cómo resolverla"
    ],
    "opportunities": [
      "Oportunidad concreta del mercado en ${profile.country_city} relacionada con '${profile.interests}'",
      "Oportunidad de nicho poco saturado que combina '${profile.skills}'",
      "Oportunidad de tendencia digital actual en LATAM 2024-2025"
    ],
    "threats": [
      "Amenaza real del mercado en ${profile.country_city} para este tipo de servicios",
      "Amenaza de competencia o automatización específica para '${profile.skills}'",
      "Amenaza económica o regulatoria relevante para el sector en LATAM"
    ]
  },

  "ideal_clients": "Perfil detallado del cliente ideal: Industria [X], tamaño [Y empleados o facturación], cargo del decisor [Z], problema principal que tiene relacionado con '${profile.skills}', presupuesto típico en ${profile.country_city} USD [rango], dónde encontrarlos online [plataforma + comunidad específica] y offline [lugar o evento en ${profile.country_city}].",

  "first_content": "Plataforma: [LinkedIn/Instagram]. Formato: [tipo exacto]. Título: '[título específico]'. Estructura: Intro ([1-2 líneas de hook]) → Desarrollo ([3-5 puntos concretos relacionados con ${profile.skills}]) → CTA ([acción específica]). Por qué generará tracción: [razón concreta basada en el nicho y la audiencia en ${profile.country_city}]."
}`

  return { system, user }
}
