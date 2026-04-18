import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDealsByStageSummary, getDealsByStage } from '@/lib/db/deals'
import { getUpcomingActivities, getRecentActivities } from '@/lib/db/activities'
import { getContacts } from '@/lib/db/contacts'
import { STAGE_COLORS, DEAL_STAGES, ACTIVITY_TYPE_COLORS, ACTIVITY_TYPES, type DealStage } from '@/lib/types'

export default async function DashboardPage() {
  const [summary, upcoming, recent, contacts, deals] = await Promise.all([
    getDealsByStageSummary(),
    getUpcomingActivities(),
    getRecentActivities(),
    getContacts(),
    getDealsByStage(),
  ])

  const totalPipelineValue = Object.values(summary)
    .filter((_, i) => i < 4)
    .reduce((sum, s) => sum + s.value, 0)
  const totalDeals = Object.values(summary).reduce((sum, s) => sum + s.count, 0)

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Won This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.closed_won.value.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(Object.keys(summary) as DealStage[]).map((stage) => {
                const stageInfo = DEAL_STAGES.find((s) => s.value === stage)!
                return (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={STAGE_COLORS[stage]}>{stageInfo.label}</Badge>
                      <span className="text-sm text-muted-foreground">{summary[stage].count} deals</span>
                    </div>
                    <span className="font-medium">${summary[stage].value.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">No upcoming tasks. You&apos;re all caught up!</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={ACTIVITY_TYPE_COLORS[activity.type]}>
                        {ACTIVITY_TYPES.find((t) => t.value === activity.type)?.label}
                      </Badge>
                      <Link href={`/activities/${activity.id}/edit`} className="text-sm hover:underline">
                        {activity.title}
                      </Link>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.due_date}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-muted-foreground">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {recent.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={ACTIVITY_TYPE_COLORS[activity.type]}>
                        {ACTIVITY_TYPES.find((t) => t.value === activity.type)?.label}
                      </Badge>
                      <span className={activity.completed ? 'line-through text-muted-foreground' : ''}>
                        {activity.title}
                      </span>
                      {activity.contacts && (
                        <Link href={`/contacts/${activity.contact_id}`} className="text-sm text-muted-foreground hover:underline">
                          — {activity.contacts.name}
                        </Link>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
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
