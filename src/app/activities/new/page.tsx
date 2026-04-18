import { getContacts } from '@/lib/db/contacts'
import { getDealsByStage } from '@/lib/db/deals'
import { ActivityForm } from '@/components/activities/activity-form'

export default async function NewActivityPage() {
  const [contacts, deals] = await Promise.all([
    getContacts(),
    getDealsByStage(),
  ])
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">New Activity</h2>
      <ActivityForm contacts={contacts} deals={deals} />
    </div>
  )
}
