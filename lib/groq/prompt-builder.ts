import type { WizardData } from '@/lib/types'

const STYLE_INSTRUCTIONS: Record<string, string> = {
  profesional: `Usa un tono FORMAL, DIRECTO y CORPORATIVO. 
- Frases cortas y contundentes. Sin adornos.
- Lenguaje de negocios: "estrategia", "ROI", "posicionamiento", "propuesta de valor".
- Evita emojis, metáforas y lenguaje coloquial.
- Cada recomendación debe sonar como un consejo de consultor senior.`,

  cercano: `Usa un tono CONVERSACIONAL, CÁLIDO y EMPÁTICO. 
- Habla como un amigo experto que conoce el mercado LATAM.
- Usa "tú", "te recomiendo", "lo que yo haría es...".
- Incluye frases motivadoras pero realistas.
- Evita lenguaje corporativo frío.`,

  premium: `Usa un tono EXCLUSIVO, SOFISTICADO y DE ALTO VALOR.
- Cada recomendación debe transmitir escasez y exclusividad.
- Usa palabras como "selecto", "premium", "elite", "resultados excepcionales".
- Enfócate en clientes de alto ticket y posicionamiento aspiracional.
- Evita hablar de precios bajos o competencia masiva.`,

  creativo: `Usa un tono INNOVADOR, FRESCO e INSPIRADOR.
- Usa metáforas, analogías y lenguaje visual.
- Las ideas deben sentirse originales y disruptivas.
- Incluye referencias a tendencias digitales actuales.
- Evita lo convencional. Sorprende con cada recomendación.`,

  autoridad: `Usa un tono EXPERTO, CONTUNDENTE y BASADO EN DATOS.
- Cada afirmación debe sonar como verdad comprobada.
- Usa frases como "los datos muestran", "la experiencia indica", "el mercado exige".
- Sé directo y sin rodeos. No uses condicionales débiles.
- Transmite que quien sigue este plan tiene ventaja competitiva real.`,
}

const GOAL_LABELS: Record<string, string> = {
  ganar_clientes: 'Conseguir nuevos clientes de forma consistente y predecible',
  escalar_agencia: 'Escalar hacia una micro-agencia o equipo con procesos replicables',
  servicios_premium: 'Vender servicios de alto valor (USD 500+ por proyecto)',
  marca_personal: 'Construir y posicionar una marca personal reconocida en LATAM',
  nicho_rentable: 'Identificar y dominar un nicho de mercado con alta demanda y baja saturación',
}

const EXPERIENCE_CONTEXT: Record<string, string> = {
  junior: 'profesional con 0-2 años de experiencia que está construyendo su portafolio',
  mid: 'profesional con 2-5 años de experiencia que busca escalar sus ingresos',
  senior: 'profesional con 5-10 años de experiencia listo para posicionarse como referente',
  expert: 'experto con más de 10 años que puede cobrar tarifas premium y liderar proyectos complejos',
}

export function buildPrompt(data: WizardData): { system: string; user: string } {
  const { profile, goals, style } = data
  const goalsList = goals.map(g => `- ${GOAL_LABELS[g]}`).join('\n')
  const styleInstructions = STYLE_INSTRUCTIONS[style]
  const experienceContext = EXPERIENCE_CONTEXT[profile.experience]

  const system = `Eres CreadorPro AI, el consultor estratégico de negocios digitales más preciso y accionable para el mercado latinoamericano.

MISIÓN: Generar planes estratégicos que los profesionales puedan ejecutar ESTA SEMANA, no en 6 meses.

REGLAS ABSOLUTAS:
1. Responde SIEMPRE en español latinoamericano
2. CERO frases genéricas. Cada recomendación debe ser específica para el perfil dado
3. Menciona herramientas reales (Notion, Canva, LinkedIn Sales Navigator, etc.)
4. Incluye números concretos: precios en USD/MXN/COP, tiempos en días, cantidades
5. Contextualiza TODO para ${profile.country_city} y el mercado LATAM
6. TONO OBLIGATORIO para todas las respuestas: ${style.toUpperCase()}
${styleInstructions}
7. Responde ÚNICAMENTE con el JSON estructurado. Sin markdown, sin texto extra, sin explicaciones.`

  const user = `Analiza este perfil y genera un plan estratégico ULTRA-ESPECÍFICO y ACCIONABLE.

## PERFIL
- Tipo de profesional: ${experienceContext}
- Habilidades: ${profile.skills}
- Servicios actuales: ${profile.current_services}
- Intereses: ${profile.interests}
- Mercado objetivo: ${profile.country_city}, LATAM

## OBJETIVOS PRIORITARIOS
${goalsList}

## INSTRUCCIÓN CRÍTICA
Genera el plan respondiendo ÚNICAMENTE con este JSON exacto (sin markdown, sin texto extra):

{
  "executive_summary": "Resumen ejecutivo de 3-4 oraciones que explique el potencial único de este profesional en ${profile.country_city}. Menciona el nicho principal, el diferenciador clave y el primer paso concreto.",

  "top_3_opportunities": [
    "Oportunidad 1: [nombre específico] — [por qué es rentable ahora en ${profile.country_city}] — [acción concreta esta semana]",
    "Oportunidad 2: [nombre específico] — [por qué es rentable ahora] — [acción concreta]",
    "Oportunidad 3: [nombre específico] — [por qué es rentable ahora] — [acción concreta]"
  ],

  "niches": [
    {
      "name": "Nombre específico del nicho (ej: 'Gestión de redes para clínicas dentales en ${profile.country_city}')",
      "difficulty": "bajo|medio|alto",
      "economic_potential": "Rango de ingresos mensual realista en USD para ${profile.country_city} (ej: USD 800-2,000/mes)",
      "why": "Por qué este nicho es rentable AHORA para este perfil específico en 2-3 oraciones concretas"
    },
    { "name": "...", "difficulty": "bajo|medio|alto", "economic_potential": "...", "why": "..." },
    { "name": "...", "difficulty": "bajo|medio|alto", "economic_potential": "...", "why": "..." }
  ],

  "value_proposition": "Propuesta de valor en formato: 'Ayudo a [cliente específico] a [resultado concreto con número] en [tiempo] usando [método único]'. Debe ser 100% específica para el perfil.",

  "suggested_services": [
    "Servicio 1: [nombre] — [descripción en 1 línea] — [precio sugerido en USD para ${profile.country_city}]",
    "Servicio 2: [nombre] — [descripción] — [precio]",
    "Servicio 3: [nombre] — [descripción] — [precio]"
  ],

  "pricing_suggestions": [
    "Servicio básico/entrada: USD [X]-[Y] — [qué incluye en 1 línea]",
    "Servicio intermedio: USD [X]-[Y] — [qué incluye]",
    "Servicio premium/retainer: USD [X]-[Y]/mes — [qué incluye]"
  ],

  "differentiators": [
    "Diferenciador 1: [qué hace único a este profesional] — [cómo comunicarlo en 1 frase]",
    "Diferenciador 2: ...",
    "Diferenciador 3: ..."
  ],

  "competitive_positioning": "Cómo posicionarse frente a la competencia en ${profile.country_city}. Incluye: qué hacen mal los competidores, qué puede hacer mejor este profesional, y cómo comunicar esa ventaja.",

  "acquisition_strategy": "Estrategia de captación en 4 pasos concretos y numerados. Cada paso debe tener una acción específica, una herramienta real y un tiempo estimado.",

  "prospecting_messages": [
    "Mensaje para LinkedIn: [mensaje de prospección de máximo 3 líneas, personalizable, sin sonar a spam]",
    "Mensaje para WhatsApp/DM: [mensaje directo y conversacional de 2-3 líneas]",
    "Email de presentación: [asunto + cuerpo de 4-5 líneas máximo]"
  ],

  "first_ideal_client": "Descripción ultra-específica del primer cliente ideal a buscar: industria, tamaño, problema que tiene, dónde encontrarlo en ${profile.country_city}, cómo contactarlo esta semana.",

  "content_strategy": "Estrategia de contenido en 3 pilares temáticos específicos para este perfil. Para cada pilar: qué publicar, con qué frecuencia, en qué formato y por qué funciona en LATAM.",

  "post_ideas": [
    "Post 1: [formato] — [tema específico] — [ángulo/hook en 1 línea]",
    "Post 2: [formato] — [tema] — [hook]",
    "Post 3: [formato] — [tema] — [hook]",
    "Post 4: [formato] — [tema] — [hook]",
    "Post 5: [formato] — [tema] — [hook]"
  ],

  "post_hooks": [
    "Hook 1 para LinkedIn: [primera línea que para el scroll, específica para el nicho]",
    "Hook 2 para Instagram: [primera línea o caption de impacto]",
    "Hook 3 universal: [pregunta o afirmación provocadora relacionada al nicho]"
  ],

  "first_30_days_content": [
    "Semana 1: [tema central] — [3 tipos de contenido específicos a publicar]",
    "Semana 2: [tema central] — [3 tipos de contenido]",
    "Semana 3: [tema central] — [3 tipos de contenido]",
    "Semana 4: [tema central + CTA de conversión] — [3 tipos de contenido]"
  ],

  "linkedin_strategy": "Estrategia LinkedIn en 3 pasos accionables esta semana: optimización del perfil (qué cambiar exactamente), tipo de contenido a publicar (formato y frecuencia), y táctica de networking (a quién conectar y cómo).",

  "instagram_strategy": "Estrategia Instagram en 3 pasos: tipo de cuenta y bio optimizada, mix de contenido (% reels vs posts vs stories), y táctica de crecimiento orgánico específica para el nicho.",

  "linkedin_bio": "Bio optimizada para LinkedIn de máximo 3 líneas: [cargo/especialidad] | [resultado que genera] | [CTA o dato de contacto]. Debe incluir palabras clave del nicho.",

  "instagram_bio": "Bio optimizada para Instagram de máximo 4 líneas con emojis: [quién eres en 1 línea] | [a quién ayudas] | [resultado concreto] | [CTA con link].",

  "commercial_offer": "Oferta comercial estructurada: nombre del paquete, qué incluye (5-7 entregables específicos), precio, tiempo de entrega, garantía o diferenciador, y cómo presentarla.",

  "pitch": "Pitch profesional de 30 segundos en formato: Problema → Solución → Resultado → CTA. Debe ser específico para el nicho y sonar natural al hablar.",

  "growth_roadmap": [
    "Mes 1-2: [objetivo específico] — [3 acciones concretas] — [métrica de éxito]",
    "Mes 3-4: [objetivo] — [3 acciones] — [métrica]",
    "Mes 5-6: [objetivo] — [3 acciones] — [métrica]",
    "Mes 7-12: [objetivo de escala] — [3 acciones] — [métrica]"
  ],

  "seven_day_plan": [
    "Día 1: [acción específica con herramienta y tiempo estimado]",
    "Día 2: [acción específica]",
    "Día 3: [acción específica]",
    "Día 4: [acción específica]",
    "Día 5: [acción específica]",
    "Día 6: [acción específica]",
    "Día 7: [acción de cierre/revisión]"
  ],

  "common_mistakes": [
    "Error 1: [error común en este nicho en LATAM] — [cómo evitarlo]",
    "Error 2: [error] — [cómo evitarlo]",
    "Error 3: [error] — [cómo evitarlo]"
  ],

  "useful_tools": [
    "Herramienta 1: [nombre] — [para qué usarla específicamente] — [plan gratuito disponible: sí/no]",
    "Herramienta 2: [nombre] — [uso específico] — [gratuito: sí/no]",
    "Herramienta 3: [nombre] — [uso específico] — [gratuito: sí/no]",
    "Herramienta 4: [nombre] — [uso específico] — [gratuito: sí/no]"
  ],

  "swot": {
    "strengths": ["Fortaleza 1 específica del perfil", "Fortaleza 2", "Fortaleza 3"],
    "weaknesses": ["Debilidad 1 a trabajar", "Debilidad 2", "Debilidad 3"],
    "opportunities": ["Oportunidad 1 del mercado en ${profile.country_city}", "Oportunidad 2", "Oportunidad 3"],
    "threats": ["Amenaza 1 del mercado", "Amenaza 2", "Amenaza 3"]
  },

  "ideal_clients": "Perfil detallado del cliente ideal: industria, tamaño de empresa, cargo del decisor, problema principal que tiene, presupuesto típico en ${profile.country_city}, dónde encontrarlo online y offline.",

  "first_content": "El primer contenido a publicar esta semana: plataforma, formato exacto, tema, estructura del post (intro + desarrollo + CTA), y por qué este contenido específico generará tracción inmediata."
}

RECORDATORIO FINAL: 
- Tono OBLIGATORIO: ${style.toUpperCase()} en TODO el documento
- Cero frases genéricas como "es importante que", "debes considerar", "en el mundo digital"
- Cada precio debe ser realista para ${profile.country_city} en 2024-2025
- Cada acción debe poder ejecutarse con menos de 2 horas de trabajo`

  return { system, user }
}
