'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ACTIVITY_TYPES } from '@/lib/types'

export function ActivityFilters({
  currentType,
  currentCompleted,
}: {
  currentType?: string | null
  currentCompleted?: string | null
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilters(key: string, value: string | null) {
    if (value === null) return
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/activities?${params.toString()}`)
  }

  return (
    <div className="flex gap-3">
      <Select value={currentType || 'all'} onValueChange={(v) => updateFilters('type', v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {ACTIVITY_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentCompleted || 'all'} onValueChange={(v) => updateFilters('completed', v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="false">Pending</SelectItem>
          <SelectItem value="true">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
