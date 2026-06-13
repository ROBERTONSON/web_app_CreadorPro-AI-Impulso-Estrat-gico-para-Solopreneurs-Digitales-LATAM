import { getApiKeys } from '@/lib/groq/client'
import Groq from 'groq-sdk'
import { buildPromptPart1, buildPromptPart2 } from '@/lib/groq/prompt-builder'
import { parseStrategyReport } from '@/lib/groq/parser'
import { createClient } from '@/lib/supabase/server'
import type { WizardData } from '@/lib/types'

export const maxDuration = 60

const FREE_LIMIT = 3
const PREMIUM_LIMIT = 90

const MODELS = [
  'llama-3.3-70b-versatile', // best quality, 100k tokens/day per key
  'llama-3.1-8b-instant',    // fallback model, 500k tokens/day per key
]

function isRateLimit(err: unknown): boolean {
  return !!(err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 429)
}

function extractRetryAfter(err: unknown): number | null {
  try {
    const msg = err instanceof Error ? err.message : String(err)
    const m = msg.match(/try again in (\d+)m(\d+(?:\.\d+)?)s/)
    if (m) return parseInt(m[1]) * 60 + Math.ceil(parseFloat(m[2]))
    const s = msg.match(/try again in (\d+(?:\.\d+)?)s/)
    if (s) return Math.ceil(parseFloat(s[1]))
  } catch { /* ignore */ }
  return null
}

// Full cascade: key1+model1 → key1+model2 → key2+model1 → key2+model2
async function callWithCascade(system: string, user: string): Promise<string> {
  const keys = getApiKeys()
  let lastErr: unknown

  for (const apiKey of keys) {
    const groq = new Groq({ apiKey })
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
        if (isRateLimit(err)) {
          console.warn(`[generate] Rate limit: key=${apiKey.slice(-6)} model=${model}, trying next...`)
          continue
        }
        // Non-rate-limit error — throw immediately
        throw err
      }
    }
  }

  throw lastErr
}

export async function POST(request: Request) {
  try {
    // Auth + plan check
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const currentMonth = new Date().toISOString().slice(0, 7)

    // Upsert profile if first time (trigger may not have fired yet)
    await supabase
      .from('user_profiles')
      .upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true })

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('plan, generations_this_month, billing_month')
      .eq('id', user.id)
      .single()

    if (profile) {
      const effectiveCount = profile.billing_month !== currentMonth ? 0 : profile.generations_this_month
      const limit = profile.plan === 'premium' ? PREMIUM_LIMIT : FREE_LIMIT

      if (effectiveCount >= limit) {
        return Response.json({ error: 'generation_limit_reached' }, { status: 403 })
      }

      // Increment counter
      await supabase
        .from('user_profiles')
        .update({
          generations_this_month: effectiveCount + 1,
          billing_month: currentMonth,
        })
        .eq('id', user.id)
    }

    const wizardData: WizardData = await request.json()

    const { system: sys1, user: usr1 } = buildPromptPart1(wizardData)
    const { system: sys2, user: usr2 } = buildPromptPart2(wizardData)

    const raw1 = await callWithCascade(sys1, usr1)
    const raw2 = await callWithCascade(sys2, usr2)

    const report = parseStrategyReport(raw1, raw2)
    return Response.json(report)
  } catch (err) {
    console.error('[generate] error:', err)

    if (isRateLimit(err)) {
      const retryAfter = extractRetryAfter(err)
      return Response.json({ error: 'rate_limit', retryAfter }, { status: 429 })
    }

    return Response.json(
      { error: 'No se pudo generar el plan. Por favor intenta de nuevo.' },
      { status: 500 }
    )
  }
}
