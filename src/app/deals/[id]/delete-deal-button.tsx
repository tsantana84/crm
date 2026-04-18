'use client'

import { deleteDealAction } from '@/actions/deals'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DeleteDealButton({
  dealId,
  dealTitle,
}: {
  dealId: string
  dealTitle: string
}) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${dealTitle}"? This cannot be undone.`)) return
    try {
      await deleteDealAction(dealId)
      toast.success('Deal deleted')
      router.push('/deals')
      router.refresh()
    } catch {
      toast.error('Failed to delete deal')
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  )
}
