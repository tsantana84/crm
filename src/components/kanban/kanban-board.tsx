'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { updateDealStageAction } from '@/actions/deals'
import { STAGE_COLORS, DEAL_STAGES, type Deal, type DealStage } from '@/lib/types'
import { DealCard } from './deal-card'
import { DealCardOverlay } from './deal-card-overlay'
import { toast } from 'sonner'

type Items = Record<DealStage, Deal[]>

function DroppableColumn({
  stage,
  deals,
  children,
}: {
  stage: DealStage
  deals: Deal[]
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const stageInfo = DEAL_STAGES.find((s) => s.value === stage)!

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[260px] flex-col rounded-lg border bg-muted/30 ${
        isOver ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Badge className={STAGE_COLORS[stage]}>{stageInfo.label}</Badge>
          <span className="text-sm text-muted-foreground">{deals.length}</span>
        </div>
        <span className="text-sm font-medium">
          ${deals.reduce((sum, d) => sum + Number(d.value), 0).toLocaleString()}
        </span>
      </div>
      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2 p-2">{children}</div>
      </SortableContext>
    </div>
  )
}

export function KanbanBoard({ initialDeals }: { initialDeals: Deal[] }) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  const grouped: Items = {
    lead: [],
    qualified: [],
    proposal: [],
    negotiation: [],
    closed_won: [],
    closed_lost: [],
  }
  for (const deal of deals) {
    grouped[deal.stage].push(deal)
  }

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function findContainer(id: UniqueIdentifier): DealStage | undefined {
    if (id in grouped) return id as DealStage
    return (Object.keys(grouped) as DealStage[]).find((key) =>
      grouped[key].some((d) => d.id === id)
    )
  }

  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      if (activeId && activeId in grouped) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (c: any) => c.id in grouped
          ),
        })
      }

      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId in grouped) {
          const containerItems = grouped[overId as DealStage]
          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (c: any) => containerItems.some((d) => d.id === c.id)
              ),
            })[0]?.id
          }
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, deals]
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    const overId = over?.id
    if (overId == null || active.id in grouped) return

    const overContainer = findContainer(overId)
    const activeContainer = findContainer(active.id)
    if (!overContainer || !activeContainer || activeContainer === overContainer) return

    setDeals((prev) => {
      const activeItems = grouped[activeContainer]
      const overItems = grouped[overContainer]
      const overIndex = overItems.findIndex((d) => d.id === overId)
      const activeIndex = activeItems.findIndex((d) => d.id === active.id)

      const isBelowOverItem =
        over &&
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const newIndex = overIndex >= 0 ? overIndex + (isBelowOverItem ? 1 : 0) : overItems.length

      const deal = activeItems[activeIndex]
      return prev.map((d) =>
        d.id === deal.id ? { ...d, stage: overContainer } : d
      )
    })
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)
    if (!activeContainer || !overContainer) return

    const deal = deals.find((d) => d.id === active.id)
    if (!deal) return

    if (deal.stage !== activeContainer) {
      try {
        await updateDealStageAction(deal.id, deal.stage)
      } catch {
        toast.error('Failed to update deal stage')
        setDeals(initialDeals)
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null)
    setDeals(initialDeals)
  }

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pipeline</h2>
        <Link href="/deals/new" className={buttonVariants({ variant: "default" })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Link>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {(Object.keys(grouped) as DealStage[]).map((stage) => (
            <DroppableColumn key={stage} stage={stage} deals={grouped[stage]}>
              {grouped[stage].map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
              {grouped[stage].length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Drop deals here
                </div>
              )}
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? <DealCardOverlay deal={activeDeal} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
