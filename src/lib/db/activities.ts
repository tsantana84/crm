import { createClient } from '@/lib/supabase/server'
import type { Activity, ActivityInsert } from '@/lib/types'

export async function getActivities(filters?: {
  type?: string
  completed?: boolean
  overdue?: boolean
  contact_id?: string
  deal_id?: string
}) {
  const supabase = await createClient()
  let query = supabase
    .from('activities')
    .select('*, contacts(*), deals(*)')
    .order('due_date', { ascending: true, nullsFirst: false })

  if (filters?.type) query = query.eq('type', filters.type)
  if (filters?.completed !== undefined) query = query.eq('completed', filters.completed)
  if (filters?.overdue) {
    query = query
      .lt('due_date', new Date().toISOString().split('T')[0])
      .eq('completed', false)
  }
  if (filters?.contact_id) query = query.eq('contact_id', filters.contact_id)
  if (filters?.deal_id) query = query.eq('deal_id', filters.deal_id)

  const { data, error } = await query
  if (error) throw error
  return (data as Activity[]) || []
}

export async function getActivity(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*, contacts(*), deals(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Activity
}

export async function createActivity(activity: ActivityInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select('*, contacts(*), deals(*)')
    .single()
  if (error) throw error
  return data as Activity
}

export async function updateActivity(id: string, activity: Partial<ActivityInsert>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .update({ ...activity, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, contacts(*), deals(*)')
    .single()
  if (error) throw error
  return data as Activity
}

export async function toggleActivityComplete(id: string, completed: boolean) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Activity
}

export async function deleteActivity(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('activities').delete().eq('id', id)
  if (error) throw error
}

export async function getUpcomingActivities(limit = 7) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('activities')
    .select('*, contacts(*), deals(*)')
    .eq('completed', false)
    .gte('due_date', today)
    .order('due_date', { ascending: true })
    .limit(limit)
  if (error) throw error
  return (data as Activity[]) || []
}

export async function getRecentActivities(limit = 10) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*, contacts(*), deals(*)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as Activity[]) || []
}
