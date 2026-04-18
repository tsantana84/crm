import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockRevalidatePath, mockDb } = vi.hoisted(() => ({
  mockRevalidatePath: vi.fn(),
  mockDb: {
    createActivity: vi.fn(),
    updateActivity: vi.fn(),
    toggleActivityComplete: vi.fn(),
    deleteActivity: vi.fn(),
  },
}))

vi.mock('next/cache', () => ({ revalidatePath: mockRevalidatePath }))
vi.mock('@/lib/db/activities', () => mockDb)

import {
  createActivityAction,
  updateActivityAction,
  toggleActivityCompleteAction,
  deleteActivityAction,
} from '@/actions/activities'

beforeEach(() => vi.clearAllMocks())

const payload = {
  title: 'Call Alice',
  type: 'call' as const,
  due_date: null,
  description: null,
  contact_id: null,
  deal_id: null,
}
const activity = { id: '1', ...payload, completed: false, created_at: '', updated_at: '' }

describe('createActivityAction', () => {
  it('calls db.createActivity and revalidates /activities', async () => {
    mockDb.createActivity.mockResolvedValue(activity)

    const result = await createActivityAction(payload)

    expect(mockDb.createActivity).toHaveBeenCalledWith(payload)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/activities')
    expect(result).toEqual(activity)
  })
})

describe('updateActivityAction', () => {
  it('revalidates /activities and /activities/:id', async () => {
    mockDb.updateActivity.mockResolvedValue(activity)

    await updateActivityAction('1', { title: 'Updated' })

    expect(mockDb.updateActivity).toHaveBeenCalledWith('1', { title: 'Updated' })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/activities')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/activities/1')
  })
})

describe('toggleActivityCompleteAction', () => {
  it('revalidates /activities and /', async () => {
    mockDb.toggleActivityComplete.mockResolvedValue({ ...activity, completed: true })

    await toggleActivityCompleteAction('1', true)

    expect(mockDb.toggleActivityComplete).toHaveBeenCalledWith('1', true)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/activities')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })

  it('works for marking incomplete', async () => {
    mockDb.toggleActivityComplete.mockResolvedValue({ ...activity, completed: false })

    await toggleActivityCompleteAction('1', false)

    expect(mockDb.toggleActivityComplete).toHaveBeenCalledWith('1', false)
  })
})

describe('deleteActivityAction', () => {
  it('calls db.deleteActivity and revalidates /activities only', async () => {
    mockDb.deleteActivity.mockResolvedValue(undefined)

    await deleteActivityAction('1')

    expect(mockDb.deleteActivity).toHaveBeenCalledWith('1')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/activities')
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1)
  })

  it('propagates DB errors', async () => {
    mockDb.deleteActivity.mockRejectedValue(new Error('delete failed'))

    await expect(deleteActivityAction('1')).rejects.toThrow('delete failed')
  })
})
