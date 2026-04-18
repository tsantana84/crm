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
import { createDealAction, updateDealAction } from '@/actions/deals'
import { toast } from 'sonner'
import { DEAL_STAGES, type Deal, type DealStage, type Contact } from '@/lib/types'

const dealSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  value: z.string().min(1, 'Value is required'),
  stage: z.string().min(1, 'Select a stage'),
  contact_id: z.string().optional(),
  notes: z.string().optional(),
})

type DealFormValues = z.infer<typeof dealSchema>

export function DealForm({ deal, contacts }: { deal?: Deal; contacts: Contact[] }) {
  const router = useRouter()
  const isEditing = !!deal

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: deal?.title ?? '',
      value: deal?.value != null ? String(deal.value) : '0',
      stage: deal?.stage ?? 'lead',
      contact_id: deal?.contact_id ?? '',
      notes: deal?.notes ?? '',
    },
  })

  async function onSubmit(data: DealFormValues) {
    try {
      const cleaned = {
        ...data,
        value: parseFloat(data.value) || 0,
        stage: data.stage as DealStage,
        contact_id: data.contact_id || null,
        notes: data.notes || null,
      }
      if (isEditing) {
        await updateDealAction(deal.id, cleaned)
        toast.success('Deal updated')
      } else {
        await createDealAction(cleaned)
        toast.success('Deal created')
      }
      router.push('/deals')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} id="title" placeholder="Website redesign" />
          )}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Value ($)</Label>
        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <Input {...field} id="value" type="number" step="0.01" min="0" placeholder="0.00" />
          )}
        />
        {errors.value && <p className="text-sm text-destructive">{errors.value.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Stage *</Label>
        <Controller
          name="stage"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {DEAL_STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.stage && <p className="text-sm text-destructive">{errors.stage.message}</p>}
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
        <Label htmlFor="notes">Notes</Label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea {...field} id="notes" placeholder="Deal notes..." rows={3} />
          )}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? 'Update Deal' : 'Create Deal'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
