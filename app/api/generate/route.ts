import { groq } from '@/lib/groq/client'
import { buildPrompt } from '@/lib/groq/prompt-builder'
import { parseStrategyReport } from '@/lib/groq/parser'
import type { WizardData } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const wizardData: WizardData = await request.json()

    const { system, user } = buildPrompt(wizardData)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      })

      clearTimeout(timeout)

      const raw = completion.choices[0]?.message?.content ?? ''
      const report = parseStrategyReport(raw)

      return Response.json(report)
    } catch (err) {
      clearTimeout(timeout)
      throw err
    }
  } catch (err) {
    console.error('Groq API error:', err)
    return Response.json(
      { error: 'No se pudo generar el plan. Por favor intenta de nuevo.' },
      { status: 500 }
    )
  }
}
