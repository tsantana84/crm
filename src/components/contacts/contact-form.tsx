'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createContactAction, updateContactAction } from '@/actions/contacts'
import { toast } from 'sonner'
import type { Contact } from '@/lib/types'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactForm({ contact }: { contact?: Contact }) {
  const router = useRouter()
  const isEditing = !!contact

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name ?? '',
      email: contact?.email ?? '',
      phone: contact?.phone ?? '',
      company: contact?.company ?? '',
      notes: contact?.notes ?? '',
    },
  })

  async function onSubmit(data: ContactFormValues) {
    try {
      const cleaned = {
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        notes: data.notes || null,
      }
      if (isEditing) {
        await updateContactAction(contact.id, cleaned)
        toast.success('Contact updated')
      } else {
        await createContactAction(cleaned)
        toast.success('Contact created')
      }
      router.push('/contacts')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} id="name" placeholder="John Doe" />
          )}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} id="email" type="email" placeholder="john@example.com" />
          )}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input {...field} id="phone" placeholder="+1 555 000 0000" />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <Input {...field} id="company" placeholder="Acme Inc." />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea {...field} id="notes" placeholder="Additional notes..." rows={3} />
          )}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? 'Update Contact' : 'Create Contact'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
