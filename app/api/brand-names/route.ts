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
          temperature: 0.8,
          max_tokens: 1500,
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
    const { profile } = wizardData

    const system = `Eres un experto en branding y naming para emprendedores digitales de LATAM. 
Generas nombres de marca creativos, memorables y disponibles. Responde SOLO en español, SOLO con el JSON solicitado.`

    const user = `Genera nombres de marca y eslóganes para un profesional de ${profile.country_city} con estas características:
- Habilidades: ${profile.skills}
- Servicios: ${profile.current_services}
- Nicho: ${nicheName}

Responde SOLO con este JSON:
{
  "names": [
    {
      "name": "nombre de marca",
      "type": "tipo (personal/creativo/descriptivo/abstracto)",
      "meaning": "qué transmite o significa",
      "domain_hint": "sugerencia de dominio ej: nombredmarca.com",
      "slogan": "eslogan corto y memorable (max 8 palabras)"
    },
    { "name": "...", "type": "...", "meaning": "...", "domain_hint": "...", "slogan": "..." },
    { "name": "...", "type": "...", "meaning": "...", "domain_hint": "...", "slogan": "..." },
    { "name": "...", "type": "...", "meaning": "...", "domain_hint": "...", "slogan": "..." },
    { "name": "...", "type": "...", "meaning": "...", "domain_hint": "...", "slogan": "..." }
  ],
  "naming_tips": ["consejo 1 para elegir tu nombre de marca", "consejo 2", "consejo 3"]
}`

    const raw = await callWithCascade(system, user)
    const result = JSON.parse(raw)
    return Response.json(result)
  } catch (err) {
    if (isRateLimit(err)) return Response.json({ error: 'rate_limit' }, { status: 429 })
    return Response.json({ error: 'No se pudieron generar los nombres.' }, { status: 500 })
  }
}
