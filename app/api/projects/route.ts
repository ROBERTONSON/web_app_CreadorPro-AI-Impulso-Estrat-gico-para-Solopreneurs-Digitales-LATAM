import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const FREE_HISTORY_LIMIT = 3

// GET — list user projects
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check plan to determine limit
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const limit = profile?.plan === 'premium' ? 100 : FREE_HISTORY_LIMIT

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, created_at, wizard_data, report')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — save project
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check history limit for free users
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan === 'free') {
    const { count } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) >= FREE_HISTORY_LIMIT) {
      return NextResponse.json({ error: 'history_limit_reached' }, { status: 403 })
    }
  }

  const { name, wizard_data, report } = await request.json()
  const { data, error } = await supabase
    .from('projects')
    .insert({ user_id: user.id, name: name || 'Mi Plan Estratégico', wizard_data, report })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
