import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Only process payment notifications
    if (type !== 'payment') return NextResponse.json({ ok: true })

    const paymentId = data?.id
    if (!paymentId) return NextResponse.json({ ok: true })

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) return NextResponse.json({ error: 'MP not configured' }, { status: 500 })

    // Fetch payment details from MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!mpRes.ok) return NextResponse.json({ error: 'MP fetch failed' }, { status: 500 })

    const payment = await mpRes.json()

    // Only activate premium on approved payments
    if (payment.status !== 'approved') return NextResponse.json({ ok: true })

    const userId = payment.external_reference
    if (!userId) return NextResponse.json({ error: 'No user ID' }, { status: 400 })

    // Activate premium in Supabase using admin/service role (bypasses RLS)
    const supabaseAdmin = createAdminClient()
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        plan: 'premium',
        premium_since: new Date().toISOString(),
        mp_payment_id: String(paymentId),
      })
      .eq('id', userId)

    if (error) {
      console.error('[webhook] Supabase error:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    console.log(`[webhook] Premium activated for user ${userId}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
