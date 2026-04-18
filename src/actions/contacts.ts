'use server'

import { revalidatePath } from 'next/cache'
import * as db from '@/lib/db/contacts'
import type { ContactInsert } from '@/lib/types'

export async function createContactAction(contact: ContactInsert) {
  const result = await db.createContact(contact)
  revalidatePath('/contacts')
  return result
}

export async function updateContactAction(id: string, contact: Partial<ContactInsert>) {
  const result = await db.updateContact(id, contact)
  revalidatePath('/contacts')
  revalidatePath(`/contacts/${id}`)
  return result
}

export async function deleteContactAction(id: string) {
  await db.deleteContact(id)
  revalidatePath('/contacts')
}
