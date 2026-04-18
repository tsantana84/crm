'use client'

import { toggleActivityCompleteAction } from '@/actions/activities'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function ToggleCompleteButton({
  activityId,
  completed,
}: {
  activityId: string
  completed: boolean
}) {
  const router = useRouter()

  async function handleToggle() {
    try {
      await toggleActivityCompleteAction(activityId, !completed)
      router.refresh()
    } catch {
      toast.error('Failed to update activity')
    }
  }

  return <Checkbox checked={completed} onCheckedChange={handleToggle} />
}
