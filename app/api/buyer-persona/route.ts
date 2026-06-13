import { getApiKeys } from '@/lib/groq/client'
import Groq from 'groq-sdk'
import type { WizardData } from '@/lib/types'

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
    const { wizardData, nicheName }: { wizardData: WizardData; nicheName: string } = await request.json()
    const { profile, goals } = wizardData

    const system = `Eres un experto en marketing digital para LATAM. Generas Buyer Personas ultra-específicos y accionables. Responde SOLO en español, SOLO con el JSON solicitado.`

    const user = `Crea un Buyer Persona detallado para un profesional de ${profile.country_city} con las siguientes características:
- Habilidades: ${profile.skills}
- Servicios: ${profile.current_services}
- Nicho objetivo: ${nicheName}
- Objetivos: ${goals.join(', ')}

Responde SOLO con este JSON:
{
  "name": "nombre ficticio representativo",
  "age": "rango de edad (ej: 28-35 años)",
  "location": "ciudad/región específica en LATAM",
  "occupation": "cargo/ocupación específica",
  "income": "rango de ingresos mensual en USD o moneda local de ${profile.country_city}",
  "pain_points": ["problema 1 específico", "problema 2", "problema 3"],
  "goals": ["objetivo 1 de este cliente", "objetivo 2", "objetivo 3"],
  "objections": ["objeción 1 para contratar el servicio", "objeción 2", "objeción 3"],
  "channels": ["canal 1 donde lo encuentras", "canal 2", "canal 3"],
  "buying_trigger": "qué lo haría contratar el servicio HOY",
  "message": "mensaje clave que resuena con este buyer persona en 1-2 oraciones"
}`

    const raw = await callWithCascade(system, user)
    const persona = JSON.parse(raw)
    return Response.json(persona)
  } catch (err) {
    if (isRateLimit(err)) return Response.json({ error: 'rate_limit' }, { status: 429 })
    return Response.json({ error: 'No se pudo generar el Buyer Persona.' }, { status: 500 })
  }
}
