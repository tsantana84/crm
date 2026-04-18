import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({ from: mockFrom }),
}))

import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  toggleActivityComplete,
  deleteActivity,
  getUpcomingActivities,
  getRecentActivities,
} from '@/lib/db/activities'

beforeEach(() => vi.clearAllMocks())

function buildChain(result: { data?: unknown; error?: unknown }) {
  const resolvable: Record<string, unknown> = {
    then: (res: (v: unknown) => unknown) => Promise.resolve(result).then(res),
  }
  const methods = ['select', 'order', 'eq', 'lt', 'gte', 'limit']
  for (const m of methods) {
    resolvable[m] = vi.fn().mockReturnValue(resolvable)
  }
  return resolvable
}

describe('getActivities', () => {
  it('returns activities with no filters', async () => {
    const activities = [{ id: '1', title: 'Call Alice' }]
    mockFrom.mockReturnValue(buildChain({ data: activities, error: null }))

    const result = await getActivities()
    expect(result).toEqual(activities)
  })

  it('returns empty array when data is null', async () => {
    mockFrom.mockReturnValue(buildChain({ data: null, error: null }))

    const result = await getActivities()
    expect(result).toEqual([])
  })

  it('throws on error', async () => {
    mockFrom.mockReturnValue(buildChain({ data: null, error: new Error('DB error') }))

    await expect(getActivities()).rejects.toThrow('DB error')
  })

  it('applies type filter', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await getActivities({ type: 'call' })
    expect(chain.eq as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('type', 'call')
  })

  it('applies completed filter', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await getActivities({ completed: false })
    expect(chain.eq as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('completed', false)
  })

  it('applies overdue filter', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await getActivities({ overdue: true })
    expect(chain.lt as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(
      'due_date',
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
    )
    expect(chain.eq as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('completed', false)
  })

  it('applies contact_id filter', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await getActivities({ contact_id: 'c-1' })
    expect(chain.eq as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('contact_id', 'c-1')
  })

  it('applies deal_id filter', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await getActivities({ deal_id: 'd-1' })
    expect(chain.eq as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('deal_id', 'd-1')
  })
})

describe('getActivity', () => {
  it('returns single activity', async () => {
    const activity = { id: '1', title: 'Call Alice' }
    const singleMock = vi.fn().mockResolvedValue({ data: activity, error: null })
    const eqMock = vi.fn().mockReturnValue({ single: singleMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ select: selectMock })

    const result = await getActivity('1')
    expect(eqMock).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual(activity)
  })

  it('throws on error', async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: new Error('not found') })
    const eqMock = vi.fn().mockReturnValue({ single: singleMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ select: selectMock })

    await expect(getActivity('missing')).rejects.toThrow('not found')
  })
})

describe('createActivity', () => {
  it('inserts and returns activity', async () => {
    const activity = { id: '1', title: 'Call', type: 'call', completed: false }
    const singleMock = vi.fn().mockResolvedValue({ data: activity, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertMock = vi.fn().mockReturnValue({ select: selectMock })
    mockFrom.mockReturnValue({ insert: insertMock })

    const result = await createActivity({
      title: 'Call',
      type: 'call',
      due_date: null,
      description: null,
      contact_id: null,
      deal_id: null,
    })
    expect(result).toEqual(activity)
  })
})

describe('updateActivity', () => {
  it('includes updated_at in payload', async () => {
    const activity = { id: '1', title: 'Updated' }
    const singleMock = vi.fn().mockResolvedValue({ data: activity, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const eqMock = vi.fn().mockReturnValue({ select: selectMock })
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ update: updateMock })

    await updateActivity('1', { title: 'Updated' })
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Updated', updated_at: expect.any(String) })
    )
  })
})

describe('toggleActivityComplete', () => {
  it('sets completed flag', async () => {
    const activity = { id: '1', completed: true }
    const singleMock = vi.fn().mockResolvedValue({ data: activity, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const eqMock = vi.fn().mockReturnValue({ select: selectMock })
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ update: updateMock })

    const result = await toggleActivityComplete('1', true)
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ completed: true, updated_at: expect.any(String) })
    )
    expect(result).toEqual(activity)
  })
})

describe('deleteActivity', () => {
  it('deletes without throwing', async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null })
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ delete: deleteMock })

    await expect(deleteActivity('1')).resolves.toBeUndefined()
  })

  it('throws on error', async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: new Error('delete failed') })
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ delete: deleteMock })

    await expect(deleteActivity('1')).rejects.toThrow('delete failed')
  })
})

describe('getUpcomingActivities', () => {
  it('queries with today as lower bound and limit', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await getUpcomingActivities(5)
    expect(chain.eq as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('completed', false)
    expect(chain.gte as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(
      'due_date',
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
    )
    expect(chain.limit as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(5)
  })
})

describe('getRecentActivities', () => {
  it('queries with descending order and limit', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await getRecentActivities(3)
    expect(chain.order as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(chain.limit as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(3)
  })
})
