import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDeal } from '@/lib/db/deals'
import { getActivities } from '@/lib/db/activities'
import { STAGE_COLORS, DEAL_STAGES, ACTIVITY_TYPE_COLORS, ACTIVITY_TYPES } from '@/lib/types'
import { notFound } from 'next/navigation'
import { DeleteDealButton } from './delete-deal-button'

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const deal = await getDeal(id).catch(() => null)
  if (!deal) notFound()

  const activities = await getActivities({ deal_id: id })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/deals" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
          <h2 className="text-2xl font-bold">{deal.title}</h2>
          <Badge className={STAGE_COLORS[deal.stage]}>
            {DEAL_STAGES.find((s) => s.value === deal.stage)?.label}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/deals/${id}/edit`} className={buttonVariants({ variant: "default" })}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <DeleteDealButton dealId={deal.id} dealTitle={deal.title} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deal Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-muted-foreground">Value:</span> ${Number(deal.value).toLocaleString()}</div>
            {deal.contacts && (
              <div>
                <span className="text-muted-foreground">Contact:</span>{' '}
                <Link href={`/contacts/${deal.contact_id}`} className="hover:underline">
                  {deal.contacts.name}
                </Link>
              </div>
            )}
            {deal.notes && (
              <div><span className="text-muted-foreground">Notes:</span> {deal.notes}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activities ({activities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-muted-foreground">No activities linked to this deal.</p>
            ) : (
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={ACTIVITY_TYPE_COLORS[activity.type]}>
                        {ACTIVITY_TYPES.find((t) => t.value === activity.type)?.label}
                      </Badge>
                      <span className={activity.completed ? 'line-through text-muted-foreground' : ''}>
                        {activity.title}
                      </span>
                    </div>
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
