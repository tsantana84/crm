export type Contact = {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ContactInsert = Omit<Contact, 'id' | 'created_at' | 'updated_at'>

export type DealStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'

export type Deal = {
  id: string
  title: string
  value: number
  stage: DealStage
  contact_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  contacts?: Contact | null
}

export type DealInsert = Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contacts'>

export type ActivityType = 'call' | 'email' | 'meeting' | 'task'

export type Activity = {
  id: string
  type: ActivityType
  title: string
  description: string | null
  due_date: string | null
  completed: boolean
  contact_id: string | null
  deal_id: string | null
  created_at: string
  updated_at: string
  contacts?: Contact | null
  deals?: Deal | null
}

export type ActivityInsert = Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'contacts' | 'deals' | 'completed'> & { completed?: boolean }

export const DEAL_STAGES: { value: DealStage; label: string }[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
]

export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
]

export const STAGE_COLORS: Record<DealStage, string> = {
  lead: 'bg-slate-100 text-slate-800',
  qualified: 'bg-blue-100 text-blue-800',
  proposal: 'bg-purple-100 text-purple-800',
  negotiation: 'bg-amber-100 text-amber-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
}

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  call: 'bg-blue-100 text-blue-800',
  email: 'bg-green-100 text-green-800',
  meeting: 'bg-purple-100 text-purple-800',
  task: 'bg-amber-100 text-amber-800',
}
