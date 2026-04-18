import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getContacts } from '@/lib/db/contacts'
import { ContactSearch } from './contact-search'
import { DeleteContactButton } from './delete-contact-button'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const contacts = await getContacts(q)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contacts</h2>
        <Link href="/contacts/new" className={buttonVariants({ variant: "default" })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Link>
      </div>

      <ContactSearch defaultValue={q} />

      {contacts.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">
          {q ? 'No contacts found matching your search.' : 'No contacts yet. Create your first contact!'}
        </div>
      ) : (
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Link href={`/contacts/${contact.id}`} className="font-medium hover:underline">
                      {contact.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contact.email || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.phone || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.company || '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link href={`/contacts/${contact.id}/edit`} className={buttonVariants({ variant: "ghost", size: "sm" })}>Edit</Link>
                      <DeleteContactButton contactId={contact.id} contactName={contact.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
