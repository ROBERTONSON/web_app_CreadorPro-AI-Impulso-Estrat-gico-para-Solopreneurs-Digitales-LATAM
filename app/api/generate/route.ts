import { getGroqClient } from '@/lib/groq/client'
import { buildPromptPart1, buildPromptPart2 } from '@/lib/groq/prompt-builder'
import { parseStrategyReport } from '@/lib/groq/parser'
import type { WizardData } from '@/lib/types'

export const maxDuration = 60

// Model cascade: primary (best quality) → fallback (5x more daily quota)
const MODELS = [
  'llama-3.3-70b-versatile', // 100k tokens/day free
  'llama-3.1-8b-instant',    // 500k tokens/day free
]

function isRateLimit(err: unknown): boolean {
  if (err && typeof err === 'object' && 'status' in err) {
    return (err as { status: number }).status === 429
  }
  return false
}

// Extract retry-after seconds from Groq error message if available
function extractRetryAfter(err: unknown): number | null {
  try {
    const msg = err instanceof Error ? err.message : String(err)
    const match = msg.match(/try again in (\d+)m(\d+(?:\.\d+)?)s/)
    if (match) return parseInt(match[1]) * 60 + Math.ceil(parseFloat(match[2]))
    const matchS = msg.match(/try again in (\d+(?:\.\d+)?)s/)
    if (matchS) return Math.ceil(parseFloat(matchS[1]))
  } catch { /* ignore */ }
  return null
}

async function callGroqWithFallback(system: string, user: string): Promise<string> {
  const groq = getGroqClient()
  let lastErr: unknown

  for (const model of MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.5,
        max_tokens: 3500,
        response_format: { type: 'json_object' },
      })
      return completion.choices[0]?.message?.content ?? '{}'
    } catch (err) {
      lastErr = err
      if (isRateLimit(err) && model !== MODELS[MODELS.length - 1]) {
        console.warn(`[generate] Rate limit on ${model}, trying fallback...`)
        continue
      }
      throw err
    }
  }
  throw lastErr
}

export async function POST(request: Request) {
  try {
    const wizardData: WizardData = await request.json()

    const { system: sys1, user: usr1 } = buildPromptPart1(wizardData)
    const { system: sys2, user: usr2 } = buildPromptPart2(wizardData)

    const raw1 = await callGroqWithFallback(sys1, usr1)
    const raw2 = await callGroqWithFallback(sys2, usr2)

    const report = parseStrategyReport(raw1, raw2)
    return Response.json(report)
  } catch (err) {
    console.error('[generate] error:', err)

    // Detect rate limit exhausted (all models failed)
    if (isRateLimit(err)) {
      const retryAfter = extractRetryAfter(err)
      return Response.json(
        {
          error: 'rate_limit',
          retryAfter, // seconds, or null if unknown
        },
        { status: 429 }
      )
    }

    return Response.json(
      { error: 'No se pudo generar el plan. Por favor intenta de nuevo.' },
      { status: 500 }
    )
  }
}
