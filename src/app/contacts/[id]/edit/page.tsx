import { getContact } from '@/lib/db/contacts'
import { ContactForm } from '@/components/contacts/contact-form'
import { notFound } from 'next/navigation'

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const contact = await getContact(id).catch(() => null)
  if (!contact) notFound()

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Edit Contact</h2>
      <ContactForm contact={contact} />
    </div>
  )
}
