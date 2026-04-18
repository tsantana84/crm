'use client'

import { deleteActivityAction } from '@/actions/activities'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DeleteActivityButton({
  activityId,
  activityTitle,
}: {
  activityId: string
  activityTitle: string
}) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${activityTitle}"? This cannot be undone.`)) return
    try {
      await deleteActivityAction(activityId)
      toast.success('Activity deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete activity')
    }
  }

  return (
    <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
      Delete
    </Button>
  )
}
