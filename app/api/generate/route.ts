import { getGroqClient } from '@/lib/groq/client'
import { buildPrompt } from '@/lib/groq/prompt-builder'
import { parseStrategyReport } from '@/lib/groq/parser'
import type { WizardData } from '@/lib/types'

// Extend Vercel serverless function timeout (hobby plan max: 60s)
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const groq = getGroqClient()
    const wizardData: WizardData = await request.json()

    const { system, user } = buildPrompt(wizardData)

    console.log('[generate] prompt user length:', user.length)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60_000)

    let raw = ''
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 8192,
        response_format: { type: 'json_object' },
      })

      clearTimeout(timeout)

      raw = completion.choices[0]?.message?.content ?? ''
      console.log('[generate] raw response length:', raw.length)
      console.log('[generate] raw preview:', raw.slice(0, 200))

      const report = parseStrategyReport(raw)
      return Response.json(report)
    } catch (err) {
      clearTimeout(timeout)
      console.error('[generate] groq call error:', err)
      console.error('[generate] raw at error:', raw.slice(0, 500))
      throw err
    }
  } catch (err) {
    console.error('[generate] top-level error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return Response.json(
      { error: `No se pudo generar el plan: ${message}` },
      { status: 500 }
    )
  }
}
