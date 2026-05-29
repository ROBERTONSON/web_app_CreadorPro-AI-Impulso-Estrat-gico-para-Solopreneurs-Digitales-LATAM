import { getGroqClient } from '@/lib/groq/client'
import { buildPromptPart1, buildPromptPart2 } from '@/lib/groq/prompt-builder'
import { parseStrategyReport } from '@/lib/groq/parser'
import type { WizardData } from '@/lib/types'

export const maxDuration = 60

async function callGroq(system: string, user: string): Promise<string> {
  const groq = getGroqClient()
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.5,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  })
  return completion.choices[0]?.message?.content ?? '{}'
}

export async function POST(request: Request) {
  try {
    const wizardData: WizardData = await request.json()

    const { system: sys1, user: usr1 } = buildPromptPart1(wizardData)
    const { system: sys2, user: usr2 } = buildPromptPart2(wizardData)

    // Sequential calls — more reliable on Vercel hobby plan
    const raw1 = await callGroq(sys1, usr1)
    const raw2 = await callGroq(sys2, usr2)

    const report = parseStrategyReport(raw1, raw2)
    return Response.json(report)
  } catch (err) {
    console.error('[generate] error:', err)
    const message = err instanceof Error ? err.message : 'Error interno del servidor'
    return Response.json(
      { error: `No se pudo generar el plan. ${message}` },
      { status: 500 }
    )
  }
}
