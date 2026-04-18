import { getDealsByStage } from '@/lib/db/deals'
import { KanbanBoard } from '@/components/kanban/kanban-board'

export default async function DealsPage() {
  const deals = await getDealsByStage()
  return <KanbanBoard initialDeals={deals} />
}
