import { getApiKeys } from '@/lib/groq/client'
import Groq from 'groq-sdk'
import type { WizardData, StrategyReport } from '@/lib/types'

export const maxDuration = 60

function isRateLimit(err: unknown): boolean {
  return !!(err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 429)
}

const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']

async function callWithCascade(system: string, user: string): Promise<string> {
  const keys = getApiKeys()
  let lastErr: unknown
  for (const apiKey of keys) {
    const groq = new Groq({ apiKey })
    for (const model of MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
          temperature: 0.5,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
        })
        return completion.choices[0]?.message?.content ?? '{}'
      } catch (err) {
        lastErr = err
        if (isRateLimit(err)) continue
        throw err
      }
    }
  }
  throw lastErr
}

export async function POST(request: Request) {
  try {
    const { wizardData, report }: { wizardData: WizardData; report: StrategyReport } = await request.json()
    const { profile } = wizardData

    const system = `Eres un experto en Business Model Canvas para emprendedores digitales de LATAM.
Responde SOLO en español, SOLO con el JSON solicitado, sin markdown.`

    const user = `Completa un Business Model Canvas para este profesional de ${profile.country_city}:
- Habilidades: ${profile.skills}
- Servicios: ${profile.current_services}
- Propuesta de valor: ${report.value_proposition}
- Servicios sugeridos: ${report.suggested_services.slice(0, 3).join(' | ')}
- Precios: ${report.pricing_suggestions.slice(0, 2).join(' | ')}
- Estrategia de captación: ${report.acquisition_strategy.substring(0, 200)}

Responde SOLO con este JSON:
{
  "key_partners": ["socio/proveedor 1 específico (plataforma, herramienta o colaborador)", "socio 2", "socio 3"],
  "key_activities": ["actividad clave 1 del negocio", "actividad 2", "actividad 3"],
  "key_resources": ["recurso clave 1 (habilidad, herramienta, red)", "recurso 2", "recurso 3"],
  "value_propositions": ["propuesta principal en 1 línea", "propuesta secundaria", "diferenciador clave"],
  "customer_relationships": ["tipo de relación con clientes 1", "tipo 2", "cómo se mantiene la relación"],
  "channels": ["canal 1 para llegar a clientes", "canal 2", "canal 3"],
  "customer_segments": ["segmento principal con descripción", "segmento secundario", "segmento de nicho"],
  "cost_structure": ["costo principal (tipo y estimado USD)", "costo 2", "costo 3"],
  "revenue_streams": ["fuente de ingreso 1 con modelo y rango USD", "fuente 2", "fuente 3"]
}`

    const raw = await callWithCascade(system, user)
    const canvas = JSON.parse(raw)
    return Response.json(canvas)
  } catch (err) {
    if (isRateLimit(err)) return Response.json({ error: 'rate_limit' }, { status: 429 })
    return Response.json({ error: 'No se pudo generar el canvas.' }, { status: 500 })
  }
}
