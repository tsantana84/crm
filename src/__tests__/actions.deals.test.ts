import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockRevalidatePath, mockDb } = vi.hoisted(() => ({
  mockRevalidatePath: vi.fn(),
  mockDb: {
    createDeal: vi.fn(),
    updateDeal: vi.fn(),
    updateDealStage: vi.fn(),
    deleteDeal: vi.fn(),
  },
}))

vi.mock('next/cache', () => ({ revalidatePath: mockRevalidatePath }))
vi.mock('@/lib/db/deals', () => mockDb)

import { createDealAction, updateDealAction, updateDealStageAction, deleteDealAction } from '@/actions/deals'

beforeEach(() => vi.clearAllMocks())

const payload = { title: 'Deal A', stage: 'lead' as const, value: 1000, contact_id: null, notes: null }
const deal = { id: '1', ...payload, created_at: '', updated_at: '' }

describe('createDealAction', () => {
  it('calls db.createDeal and revalidates /deals', async () => {
    mockDb.createDeal.mockResolvedValue(deal)

    const result = await createDealAction(payload)

    expect(mockDb.createDeal).toHaveBeenCalledWith(payload)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/deals')
    expect(result).toEqual(deal)
  })
})

describe('updateDealAction', () => {
  it('revalidates /deals and /deals/:id', async () => {
    mockDb.updateDeal.mockResolvedValue(deal)

    await updateDealAction('1', { title: 'Updated' })

    expect(mockDb.updateDeal).toHaveBeenCalledWith('1', { title: 'Updated' })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/deals')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/deals/1')
  })
})

describe('updateDealStageAction', () => {
  it('revalidates /deals, /deals/:id, and /', async () => {
    mockDb.updateDealStage.mockResolvedValue({ ...deal, stage: 'qualified' })

    await updateDealStageAction('1', 'qualified')

    expect(mockDb.updateDealStage).toHaveBeenCalledWith('1', 'qualified')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/deals')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/deals/1')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })

  it('propagates DB errors', async () => {
    mockDb.updateDealStage.mockRejectedValue(new Error('stage update failed'))

    await expect(updateDealStageAction('1', 'qualified')).rejects.toThrow('stage update failed')
  })
})

describe('deleteDealAction', () => {
  it('calls db.deleteDeal and revalidates /deals only', async () => {
    mockDb.deleteDeal.mockResolvedValue(undefined)

    await deleteDealAction('1')

    expect(mockDb.deleteDeal).toHaveBeenCalledWith('1')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/deals')
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1)
  })
})
