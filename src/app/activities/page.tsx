import Link from 'next/link'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getActivities } from '@/lib/db/activities'
import { ACTIVITY_TYPE_COLORS, ACTIVITY_TYPES } from '@/lib/types'
import { ToggleCompleteButton } from './toggle-complete-button'
import { DeleteActivityButton } from './delete-activity-button'
import { ActivityFilters } from './activity-filters'

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; completed?: string }>
}) {
  const sp = await searchParams
  const type = sp.type ?? undefined
  const completed = sp.completed ?? undefined
  const filters: Parameters<typeof getActivities>[0] = {}
  if (type) filters.type = type
  if (completed === 'true') filters.completed = true
  else if (completed === 'false') filters.completed = false

  const activities = await getActivities(Object.keys(filters).length > 0 ? filters : undefined)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activities</h2>
        <Link href="/activities/new" className={buttonVariants({ variant: "default" })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Link>
      </div>

      <ActivityFilters currentType={type} currentCompleted={completed} />

      {activities.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">
          No activities found. Create your first activity!
        </div>
      ) : (
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className={activity.completed ? 'opacity-60' : ''}>
                  <TableCell>
                    <ToggleCompleteButton
                      activityId={activity.id}
                      completed={activity.completed}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/activities/${activity.id}/edit`}
                      className={`font-medium hover:underline ${activity.completed ? 'line-through' : ''}`}
                    >
                      {activity.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={ACTIVITY_TYPE_COLORS[activity.type]}>
                      {ACTIVITY_TYPES.find((t) => t.value === activity.type)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.contacts ? (
                      <Link href={`/contacts/${activity.contact_id}`} className="hover:underline">
                        {activity.contacts.name}
                      </Link>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.deals ? (
                      <Link href={`/deals/${activity.deal_id}`} className="hover:underline">
                        {activity.deals.title}
                      </Link>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.due_date || '—'}
                  </TableCell>
                  <TableCell>
                    <DeleteActivityButton activityId={activity.id} activityTitle={activity.title} />
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
