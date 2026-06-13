'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  plan: 'free' | 'premium'
  generations_this_month: number
  billing_month: string
}

const FREE_LIMIT = 3
const PREMIUM_LIMIT = 90
const FREE_HISTORY_LIMIT = 3

export function usePlan(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

  useEffect(() => {
    if (!user) { setProfile(null); setLoading(false); return }

    const supabase = createClient()

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('plan, generations_this_month, billing_month')
        .eq('id', user.id)
        .single()

      if (data) {
        // Reset counter if new month
        if (data.billing_month !== currentMonth) {
          await supabase
            .from('user_profiles')
            .update({ generations_this_month: 0, billing_month: currentMonth })
            .eq('id', user.id)
          setProfile({ ...data, generations_this_month: 0, billing_month: currentMonth })
        } else {
          setProfile(data as UserProfile)
        }
      }
      setLoading(false)
    }

    fetchProfile()

    // Realtime subscription — detects plan upgrades from webhook
    const channel = supabase
      .channel(`user_profiles:${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_profiles',
        filter: `id=eq.${user.id}`,
      }, (payload) => {
        setProfile(payload.new as UserProfile)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, currentMonth])

  const isPremium = profile?.plan === 'premium'
  const limit = isPremium ? PREMIUM_LIMIT : FREE_LIMIT
  const generationsUsed = profile?.generations_this_month ?? 0
  const generationsLeft = Math.max(0, limit - generationsUsed)
  const canGenerate = generationsUsed < limit
  const historyLimit = isPremium ? Infinity : FREE_HISTORY_LIMIT

  return { profile, loading, isPremium, generationsUsed, generationsLeft, canGenerate, historyLimit }
}
