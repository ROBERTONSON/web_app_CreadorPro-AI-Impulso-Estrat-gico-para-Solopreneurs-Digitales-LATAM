import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) return NextResponse.json({ error: 'MP not configured' }, { status: 500 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const preference = {
    items: [
      {
        id: 'creadorpro-premium',
        title: 'CreadorPro AI Premium',
        description: 'Plan mensual con generaciones ilimitadas y todas las funcionalidades',
        quantity: 1,
        currency_id: 'CLP',
        unit_price: 5990,
      },
    ],
    payer: {
      email: user.email,
    },
    external_reference: user.id,
    back_urls: {
      success: `${appUrl}/upgrade/success`,
      failure: `${appUrl}/upgrade/failure`,
      pending: `${appUrl}/upgrade/pending`,
    },
    // auto_return only works with public HTTPS URLs — disabled in local dev
    ...(appUrl.startsWith('https') ? { auto_return: 'approved' } : {}),
    // notification_url only works on a public URL — skip in local dev
    ...(appUrl.startsWith('https') ? { notification_url: `${appUrl}/api/webhooks/mercadopago` } : {}),
  }

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[checkout] MP error:', err)
    return NextResponse.json({ error: 'Error al crear preferencia' }, { status: 500 })
  }

  const data = await res.json()
  // In test mode use sandbox_init_point, in production use init_point
  const init_point = data.sandbox_init_point ?? data.init_point
  return NextResponse.json({ init_point })
}
