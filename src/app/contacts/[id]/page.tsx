import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getContact } from '@/lib/db/contacts'
import { getDealsByStage } from '@/lib/db/deals'
import { getActivities } from '@/lib/db/activities'
import { STAGE_COLORS, DEAL_STAGES } from '@/lib/types'
import { notFound } from 'next/navigation'

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const contact = await getContact(id).catch(() => null)
  if (!contact) notFound()

  const [deals, activities] = await Promise.all([
    getDealsByStage(),
    getActivities({ contact_id: id }),
  ])
  const contactDeals = deals.filter((d) => d.contact_id === id)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/contacts" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
          <h2 className="text-2xl font-bold">{contact.name}</h2>
        </div>
        <Link href={`/contacts/${id}/edit`} className={buttonVariants({ variant: "default" })}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-muted-foreground">Email:</span> {contact.email || '—'}</div>
            <div><span className="text-muted-foreground">Phone:</span> {contact.phone || '—'}</div>
            <div><span className="text-muted-foreground">Company:</span> {contact.company || '—'}</div>
            {contact.notes && (
              <div><span className="text-muted-foreground">Notes:</span> {contact.notes}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deals ({contactDeals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {contactDeals.length === 0 ? (
              <p className="text-muted-foreground">No deals linked to this contact.</p>
            ) : (
              <div className="space-y-2">
                {contactDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between">
                    <Link href={`/deals/${deal.id}`} className="font-medium hover:underline">
                      {deal.title}
                    </Link>
                    <Badge className={STAGE_COLORS[deal.stage]}>
                      {DEAL_STAGES.find((s) => s.value === deal.stage)?.label}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activities ({activities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-muted-foreground">No activities linked to this contact.</p>
            ) : (
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <span className={activity.completed ? 'line-through text-muted-foreground' : ''}>
                      {activity.title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {activity.due_date || 'No date'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
