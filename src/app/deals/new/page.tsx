import { getContacts } from '@/lib/db/contacts'
import { DealForm } from '@/components/deals/deal-form'

export default async function NewDealPage() {
  const contacts = await getContacts()
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">New Deal</h2>
      <DealForm contacts={contacts} />
    </div>
  )
}
