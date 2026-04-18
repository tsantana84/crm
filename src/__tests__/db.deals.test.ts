import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({ from: mockFrom }),
}))

import {
  getDealsByStage,
  getDeal,
  createDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
  getDealsByStageSummary,
} from '@/lib/db/deals'

beforeEach(() => vi.clearAllMocks())

function selectOrderChain(result: { data?: unknown; error?: unknown }) {
  const orderMock = vi.fn().mockResolvedValue(result)
  const selectMock = vi.fn().mockReturnValue({ order: orderMock })
  return { select: selectMock }
}

describe('getDealsByStage', () => {
  it('returns deals array', async () => {
    const deals = [{ id: '1', title: 'Deal A', stage: 'lead' }]
    mockFrom.mockReturnValue(selectOrderChain({ data: deals, error: null }))

    const result = await getDealsByStage()
    expect(result).toEqual(deals)
  })

  it('returns empty array when data is null', async () => {
    mockFrom.mockReturnValue(selectOrderChain({ data: null, error: null }))

    const result = await getDealsByStage()
    expect(result).toEqual([])
  })

  it('throws on error', async () => {
    mockFrom.mockReturnValue(selectOrderChain({ data: null, error: new Error('DB error') }))

    await expect(getDealsByStage()).rejects.toThrow('DB error')
  })
})

describe('getDeal', () => {
  it('returns single deal', async () => {
    const deal = { id: '1', title: 'Deal A' }
    const singleMock = vi.fn().mockResolvedValue({ data: deal, error: null })
    const eqMock = vi.fn().mockReturnValue({ single: singleMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ select: selectMock })

    const result = await getDeal('1')
    expect(eqMock).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual(deal)
  })

  it('throws on error', async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: new Error('not found') })
    const eqMock = vi.fn().mockReturnValue({ single: singleMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ select: selectMock })

    await expect(getDeal('missing')).rejects.toThrow('not found')
  })
})

describe('createDeal', () => {
  it('inserts and returns deal', async () => {
    const deal = { id: '1', title: 'New Deal', stage: 'lead', value: 1000 }
    const singleMock = vi.fn().mockResolvedValue({ data: deal, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertMock = vi.fn().mockReturnValue({ select: selectMock })
    mockFrom.mockReturnValue({ insert: insertMock })

    const result = await createDeal({ title: 'New Deal', stage: 'lead', value: 1000, contact_id: null, notes: null })
    expect(result).toEqual(deal)
  })
})

describe('updateDeal', () => {
  it('updates with updated_at timestamp', async () => {
    const deal = { id: '1', title: 'Updated' }
    const singleMock = vi.fn().mockResolvedValue({ data: deal, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const eqMock = vi.fn().mockReturnValue({ select: selectMock })
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ update: updateMock })

    await updateDeal('1', { title: 'Updated' })
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Updated', updated_at: expect.any(String) })
    )
  })
})

describe('updateDealStage', () => {
  it('updates stage and updated_at', async () => {
    const deal = { id: '1', stage: 'qualified' }
    const singleMock = vi.fn().mockResolvedValue({ data: deal, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const eqMock = vi.fn().mockReturnValue({ select: selectMock })
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ update: updateMock })

    const result = await updateDealStage('1', 'qualified')
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ stage: 'qualified', updated_at: expect.any(String) })
    )
    expect(result).toEqual(deal)
  })
})

describe('deleteDeal', () => {
  it('deletes without throwing', async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null })
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ delete: deleteMock })

    await expect(deleteDeal('1')).resolves.toBeUndefined()
  })

  it('throws on error', async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: new Error('delete failed') })
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
    mockFrom.mockReturnValue({ delete: deleteMock })

    await expect(deleteDeal('1')).rejects.toThrow('delete failed')
  })
})

describe('getDealsByStageSummary', () => {
  it('groups and sums deals by stage', async () => {
    const deals = [
      { id: '1', stage: 'lead', value: 1000 },
      { id: '2', stage: 'lead', value: 500 },
      { id: '3', stage: 'qualified', value: 2000 },
      { id: '4', stage: 'closed_won', value: 5000 },
    ]
    mockFrom.mockReturnValue(selectOrderChain({ data: deals, error: null }))

    const result = await getDealsByStageSummary()
    expect(result.lead).toEqual({ count: 2, value: 1500 })
    expect(result.qualified).toEqual({ count: 1, value: 2000 })
    expect(result.closed_won).toEqual({ count: 1, value: 5000 })
    expect(result.proposal).toEqual({ count: 0, value: 0 })
    expect(result.negotiation).toEqual({ count: 0, value: 0 })
    expect(result.closed_lost).toEqual({ count: 0, value: 0 })
  })

  it('returns all-zero summary for empty deals list', async () => {
    mockFrom.mockReturnValue(selectOrderChain({ data: [], error: null }))

    const result = await getDealsByStageSummary()
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as const
    for (const stage of stages) {
      expect(result[stage]).toEqual({ count: 0, value: 0 })
    }
  })

  it('handles string values by coercing to number', async () => {
    const deals = [{ id: '1', stage: 'lead', value: '750.50' }]
    mockFrom.mockReturnValue(selectOrderChain({ data: deals, error: null }))

    const result = await getDealsByStageSummary()
    expect(result.lead.value).toBe(750.5)
  })
})
