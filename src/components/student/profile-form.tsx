'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Check } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile'
import type { MyProfileData } from '@/app/actions/profile'

const ACADEMIC_LEVELS = [
  { value: 'grade_11',      label: 'Grade 11' },
  { value: 'grade_12',      label: 'Grade 12' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'honours',       label: 'Honours' },
  { value: 'postgraduate',  label: 'Postgraduate' },
  { value: 'professional',  label: 'Professional' },
]

const schema = z.object({
  firstName:     z.string().min(1, 'First name is required'),
  lastName:      z.string().min(1, 'Last name is required'),
  academicLevel: z.string().nullable().optional(),
  phone:         z.string().nullable().optional(),
})

type FormValues = z.infer<typeof schema>

interface ProfileFormProps {
  defaultValues: MyProfileData
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName:     defaultValues.firstName,
      lastName:      defaultValues.lastName,
      academicLevel: defaultValues.academicLevel ?? '',
      phone:         defaultValues.phone ?? '',
    },
  })

  async function onSubmit(values: FormValues) {
    const result = await updateProfile({
      firstName:     values.firstName,
      lastName:      values.lastName,
      academicLevel: values.academicLevel || null,
      phone:         values.phone         || null,
    })

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Profile updated successfully')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Email address
        </label>
        <p className="w-full border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground bg-cream min-h-[44px] flex items-center">
          {defaultValues.email}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here</p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-ink mb-1.5">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p id="firstName-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-ink mb-1.5">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p id="lastName-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="academicLevel" className="block text-sm font-medium text-ink mb-1.5">
          Academic level
        </label>
        <select
          id="academicLevel"
          className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] appearance-none"
          {...register('academicLevel')}
        >
          <option value="">Select your level</option>
          {ACADEMIC_LEVELS.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">
          Phone number <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+27 82 000 0000"
          className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
          {...register('phone')}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full px-6 py-3 text-sm transition-colors min-h-[44px] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        {isSubmitting
          ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
          : <><Check className="w-4 h-4" />Save changes</>
        }
      </button>
    </form>
  )
}
