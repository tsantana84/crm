import { getActivity } from '@/lib/db/activities'
import { getContacts } from '@/lib/db/contacts'
import { getDealsByStage } from '@/lib/db/deals'
import { ActivityForm } from '@/components/activities/activity-form'
import { notFound } from 'next/navigation'

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [activity, contacts, deals] = await Promise.all([
    getActivity(id).catch(() => null),
    getContacts(),
    getDealsByStage(),
  ])
  if (!activity) notFound()

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Edit Activity</h2>
      <ActivityForm activity={activity} contacts={contacts} deals={deals} />
    </div>
  )
}
