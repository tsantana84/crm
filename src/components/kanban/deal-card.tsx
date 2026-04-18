'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Deal } from '@/lib/types'

export function DealCard({ deal }: { deal: Deal }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link href={`/deals/${deal.id}`}>
        <Card className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}>
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
      </Link>
    </div>
  )
}
