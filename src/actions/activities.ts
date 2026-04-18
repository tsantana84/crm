'use server'

import { revalidatePath } from 'next/cache'
import * as db from '@/lib/db/activities'
import type { ActivityInsert } from '@/lib/types'

export async function createActivityAction(activity: ActivityInsert) {
  const result = await db.createActivity(activity)
  revalidatePath('/activities')
  return result
}

export async function updateActivityAction(id: string, activity: Partial<ActivityInsert>) {
  const result = await db.updateActivity(id, activity)
  revalidatePath('/activities')
  revalidatePath(`/activities/${id}`)
  return result
}

export async function toggleActivityCompleteAction(id: string, completed: boolean) {
  const result = await db.toggleActivityComplete(id, completed)
  revalidatePath('/activities')
  revalidatePath('/')
  return result
}

export async function deleteActivityAction(id: string) {
  await db.deleteActivity(id)
  revalidatePath('/activities')
}
