'use server'

import { revalidatePath } from 'next/cache'
import * as db from '@/lib/db/deals'
import type { DealInsert, DealStage } from '@/lib/types'

export async function createDealAction(deal: DealInsert) {
  const result = await db.createDeal(deal)
  revalidatePath('/deals')
  return result
}

export async function updateDealAction(id: string, deal: Partial<DealInsert>) {
  const result = await db.updateDeal(id, deal)
  revalidatePath('/deals')
  revalidatePath(`/deals/${id}`)
  return result
}

export async function updateDealStageAction(id: string, stage: DealStage) {
  const result = await db.updateDealStage(id, stage)
  revalidatePath('/deals')
  revalidatePath(`/deals/${id}`)
  revalidatePath('/')
  return result
}

export async function deleteDealAction(id: string) {
  await db.deleteDeal(id)
  revalidatePath('/deals')
}
