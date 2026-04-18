import { Card, CardContent } from '@/components/ui/card'
import type { Deal } from '@/lib/types'

export function DealCardOverlay({ deal }: { deal: Deal }) {
  return (
    <Card className="w-[240px] shadow-lg">
      <CardContent className="p-3">
        <div className="font-medium">{deal.title}</div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            ${Number(deal.value).toLocaleString()}
          </span>
          {deal.contacts && (
            <span className="text-muted-foreground">{deal.contacts.name}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
