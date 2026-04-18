'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createActivityAction, updateActivityAction } from '@/actions/activities'
import { toast } from 'sonner'
import { ACTIVITY_TYPES, type Activity, type ActivityType, type Contact, type Deal } from '@/lib/types'

const activitySchema = z.object({
  type: z.string().min(1, 'Select a type'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  contact_id: z.string().optional(),
  deal_id: z.string().optional(),
})

type ActivityFormValues = z.infer<typeof activitySchema>

export function ActivityForm({
  activity,
  contacts,
  deals,
}: {
  activity?: Activity
  contacts: Contact[]
  deals: Deal[]
}) {
  const router = useRouter()
  const isEditing = !!activity

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: activity?.type ?? '',
      title: activity?.title ?? '',
      description: activity?.description ?? '',
      due_date: activity?.due_date ?? '',
      contact_id: activity?.contact_id ?? '',
      deal_id: activity?.deal_id ?? '',
    },
  })

  async function onSubmit(data: ActivityFormValues) {
    try {
      const cleaned = {
        ...data,
        type: data.type as ActivityType,
        description: data.description || null,
        due_date: data.due_date || null,
        contact_id: data.contact_id || null,
        deal_id: data.deal_id || null,
      }
      if (isEditing) {
        await updateActivityAction(activity.id, cleaned)
        toast.success('Activity updated')
      } else {
        await createActivityAction(cleaned)
        toast.success('Activity created')
      }
      router.push('/activities')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label>Type *</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} id="title" placeholder="Follow-up call" />
          )}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea {...field} id="description" placeholder="Details..." rows={3} />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date</Label>
        <Controller
          name="due_date"
          control={control}
          render={({ field }) => (
            <Input {...field} id="due_date" type="date" />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Contact</Label>
        <Controller
          name="contact_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value || '_none'} onValueChange={(v) => field.onChange(v === '_none' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">No contact</SelectItem>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}{c.company ? ` — ${c.company}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Deal</Label>
        <Controller
          name="deal_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value || '_none'} onValueChange={(v) => field.onChange(v === '_none' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select deal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">No deal</SelectItem>
                {deals.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? 'Update Activity' : 'Create Activity'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
