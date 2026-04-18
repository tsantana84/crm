import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({ from: mockFrom }),
}))

import { getContacts, getContact, createContact, updateContact, deleteContact } from '@/lib/db/contacts'

beforeEach(() => vi.clearAllMocks())

describe('getContacts', () => {
  it('returns contacts array', async () => {
    const contacts = [{ id: '1', name: 'Alice' }]
    const orderMock = vi.fn().mockResolvedValue({ data: contacts, error: null })
    const selectMock = vi.fn().mockReturnValue({ order: orderMock })
    mockFrom.mockReturnValue({ select: selectMock })

    const result = await getContacts()
    expect(mockFrom).toHaveBeenCalledWith('contacts')
    expect(result).toEqual(contacts)
  })

  it('throws on error', async () => {
    const orderMock = vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') })
    const selectMock = vi.fn().mockReturnValue({ order: orderMock })
    mockFrom.mockReturnValue({ select: selectMock })

    await expect(getContacts()).rejects.toThrow('DB error')
  })

  it('applies search filter when provided', async () => {
    const orMock = vi.fn().mockResolvedValue({ data: [], error: null })
    const orderChain = { or: orMock }
    const selectChain = { order: vi.fn().mockReturnValue(orderChain) }
    mockFrom.mockReturnValue({ select: vi.fn().mockReturnValue(selectChain) })

    await getContacts('alice')
    expect(orMock).toHaveBeenCalledWith(
      'name.ilike.%alice%,email.ilike.%alice%,company.ilike.%alice%'
    )
  })
})

describe('getContact', () => {
  it('returns single contact', async () => {
    const contact = { id: '1', name: 'Alice' }
    const singleMock = vi.fn().mockResolvedValue({ data: contact, error: null })
    const eqMock = vi.fn().mockReturnValue({ single: singleMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ select: selectMock })

    const result = await getContact('1')
    expect(eqMock).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual(contact)
  })

  it('throws on error', async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: new Error('not found') })
    const eqMock = vi.fn().mockReturnValue({ single: singleMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ select: selectMock })

    await expect(getContact('missing')).rejects.toThrow('not found')
  })
})

describe('createContact', () => {
  it('inserts and returns contact', async () => {
    const contact = { id: '1', name: 'Alice', email: null, phone: null, company: null, notes: null }
    const singleMock = vi.fn().mockResolvedValue({ data: contact, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertMock = vi.fn().mockReturnValue({ select: selectMock })
    mockFrom.mockReturnValue({ insert: insertMock })

    const payload = { name: 'Alice', email: null, phone: null, company: null, notes: null }
    const result = await createContact(payload)
    expect(insertMock).toHaveBeenCalledWith(payload)
    expect(result).toEqual(contact)
  })

  it('throws on DB error', async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: new Error('insert failed') })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertMock = vi.fn().mockReturnValue({ select: selectMock })
    mockFrom.mockReturnValue({ insert: insertMock })

    await expect(
      createContact({ name: 'Alice', email: null, phone: null, company: null, notes: null })
    ).rejects.toThrow('insert failed')
  })
})

describe('updateContact', () => {
  it('updates and returns contact', async () => {
    const updated = { id: '1', name: 'Alice Updated' }
    const singleMock = vi.fn().mockResolvedValue({ data: updated, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const eqMock = vi.fn().mockReturnValue({ select: selectMock })
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ update: updateMock })

    const result = await updateContact('1', { name: 'Alice Updated' })
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Alice Updated', updated_at: expect.any(String) })
    )
    expect(eqMock).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual(updated)
  })
})

describe('deleteContact', () => {
  it('deletes without throwing', async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null })
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ delete: deleteMock })

    await expect(deleteContact('1')).resolves.toBeUndefined()
    expect(eqMock).toHaveBeenCalledWith('id', '1')
  })

  it('throws on DB error', async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: new Error('delete failed') })
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ delete: deleteMock })

    await expect(deleteContact('1')).rejects.toThrow('delete failed')
  })
})
