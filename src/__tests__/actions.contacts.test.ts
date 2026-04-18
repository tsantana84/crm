import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockRevalidatePath, mockDb } = vi.hoisted(() => ({
  mockRevalidatePath: vi.fn(),
  mockDb: {
    createContact: vi.fn(),
    updateContact: vi.fn(),
    deleteContact: vi.fn(),
  },
}))

vi.mock('next/cache', () => ({ revalidatePath: mockRevalidatePath }))
vi.mock('@/lib/db/contacts', () => mockDb)

import { createContactAction, updateContactAction, deleteContactAction } from '@/actions/contacts'

beforeEach(() => vi.clearAllMocks())

const payload = { name: 'Alice', email: null, phone: null, company: null, notes: null }
const contact = { id: '1', ...payload, created_at: '', updated_at: '' }

describe('createContactAction', () => {
  it('calls db.createContact and revalidates /contacts', async () => {
    mockDb.createContact.mockResolvedValue(contact)

    const result = await createContactAction(payload)

    expect(mockDb.createContact).toHaveBeenCalledWith(payload)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/contacts')
    expect(result).toEqual(contact)
  })

  it('propagates DB errors', async () => {
    mockDb.createContact.mockRejectedValue(new Error('insert failed'))

    await expect(createContactAction(payload)).rejects.toThrow('insert failed')
  })
})

describe('updateContactAction', () => {
  it('calls db.updateContact and revalidates both paths', async () => {
    mockDb.updateContact.mockResolvedValue(contact)

    await updateContactAction('1', { name: 'Alice Updated' })

    expect(mockDb.updateContact).toHaveBeenCalledWith('1', { name: 'Alice Updated' })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/contacts')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/contacts/1')
  })
})

describe('deleteContactAction', () => {
  it('calls db.deleteContact and revalidates /contacts', async () => {
    mockDb.deleteContact.mockResolvedValue(undefined)

    await deleteContactAction('1')

    expect(mockDb.deleteContact).toHaveBeenCalledWith('1')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/contacts')
  })

  it('propagates DB errors', async () => {
    mockDb.deleteContact.mockRejectedValue(new Error('delete failed'))

    await expect(deleteContactAction('1')).rejects.toThrow('delete failed')
  })
})
