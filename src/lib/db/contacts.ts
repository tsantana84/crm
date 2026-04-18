import { createClient } from '@/lib/supabase/server'
import type { Contact, ContactInsert } from '@/lib/types'

export async function getContacts(search?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Contact[]
}

export async function getContact(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Contact
}

export async function createContact(contact: ContactInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single()
  if (error) throw error
  return data as Contact
}

export async function updateContact(id: string, contact: Partial<ContactInsert>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contacts')
    .update({ ...contact, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Contact
}

export async function deleteContact(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw error
}
