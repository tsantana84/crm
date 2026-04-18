import { createClient } from '@/lib/supabase/server'
import type { Deal, DealInsert, DealStage } from '@/lib/types'

export async function getDealsByStage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('deals')
    .select('*, contacts(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Deal[]) || []
}

export async function getDeal(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('deals')
    .select('*, contacts(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Deal
}

export async function createDeal(deal: DealInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('deals')
    .insert(deal)
    .select('*, contacts(*)')
    .single()
  if (error) throw error
  return data as Deal
}

export async function updateDeal(id: string, deal: Partial<DealInsert>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('deals')
    .update({ ...deal, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, contacts(*)')
    .single()
  if (error) throw error
  return data as Deal
}

export async function updateDealStage(id: string, stage: DealStage) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('deals')
    .update({ stage, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, contacts(*)')
    .single()
  if (error) throw error
  return data as Deal
}

export async function deleteDeal(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('deals').delete().eq('id', id)
  if (error) throw error
}

export async function getDealsByStageSummary() {
  const deals = await getDealsByStage()
  const summary: Record<DealStage, { count: number; value: number }> = {
    lead: { count: 0, value: 0 },
    qualified: { count: 0, value: 0 },
    proposal: { count: 0, value: 0 },
    negotiation: { count: 0, value: 0 },
    closed_won: { count: 0, value: 0 },
    closed_lost: { count: 0, value: 0 },
  }
  for (const deal of deals) {
    summary[deal.stage].count++
    summary[deal.stage].value += Number(deal.value)
  }
  return summary
}
