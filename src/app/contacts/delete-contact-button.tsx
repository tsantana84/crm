'use client'

import { deleteContactAction } from '@/actions/contacts'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DeleteContactButton({
  contactId,
  contactName,
}: {
  contactId: string
  contactName: string
}) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${contactName}"? This cannot be undone.`)) return
    try {
      await deleteContactAction(contactId)
      toast.success('Contact deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete contact')
    }
  }

  return (
    <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
      Delete
    </Button>
  )
}
