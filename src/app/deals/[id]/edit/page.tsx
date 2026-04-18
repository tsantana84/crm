import { getDeal } from '@/lib/db/deals'
import { getContacts } from '@/lib/db/contacts'
import { DealForm } from '@/components/deals/deal-form'
import { notFound } from 'next/navigation'

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [deal, contacts] = await Promise.all([
    getDeal(id).catch(() => null),
    getContacts(),
  ])
  if (!deal) notFound()

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Edit Deal</h2>
      <DealForm deal={deal} contacts={contacts} />
    </div>
  )
}
