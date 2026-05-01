'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Check, User, GraduationCap, Phone, Bell, ChevronDown } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile'
import type { MyProfileData } from '@/app/actions/profile'

const ACADEMIC_LEVELS = [
  { value: 'grade_11',      label: 'Grade 11' },
  { value: 'grade_12',      label: 'Grade 12' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'postgraduate',  label: 'Postgraduate' },
]

const COMMON_SUBJECTS = [
  'Statistics',
  'Probability',
  'Data Analysis',
  'Descriptive Statistics',
  'Regression Analysis',
  'Hypothesis Testing',
  'ANOVA',
  'R Programming',
  'SPSS',
]

const schema = z.object({
  firstName:      z.string().min(1, 'First name is required'),
  lastName:       z.string().min(1, 'Last name is required'),
  phone:          z.string().nullable().optional(),
  whatsapp:       z.string().nullable().optional(),
  academicLevel:  z.string().nullable().optional(),
  school:         z.string().nullable().optional(),
  subjects:       z.string().nullable().optional(),
  bio:            z.string().max(300, 'Keep it under 300 characters').nullable().optional(),
  marketingOptin: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

interface ProfileFormProps {
  defaultValues: MyProfileData
}

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
      <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-navy" />
      </div>
      <h2 className="font-semibold text-ink">{title}</h2>
    </div>
  )
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName:      defaultValues.firstName,
      lastName:       defaultValues.lastName,
      phone:          defaultValues.phone          ?? '',
      whatsapp:       defaultValues.whatsapp       ?? '',
      academicLevel:  defaultValues.academicLevel  ?? '',
      school:         defaultValues.school         ?? '',
      subjects:       defaultValues.subjects       ?? '',
      bio:            defaultValues.bio            ?? '',
      marketingOptin: defaultValues.marketingOptin,
    },
  })

  const bio = watch('bio') ?? ''

  async function onSubmit(values: FormValues) {
    const result = await updateProfile({
      firstName:      values.firstName,
      lastName:       values.lastName,
      phone:          values.phone          || null,
      whatsapp:       values.whatsapp       || null,
      academicLevel:  values.academicLevel  || null,
      school:         values.school         || null,
      subjects:       values.subjects       || null,
      bio:            values.bio            || null,
      marketingOptin: values.marketingOptin,
    })

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Profile updated')
  }

  const inputCls = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

      {/* ── Personal Information ─────────────────────────────────────────── */}
      <section>
        <SectionHeading icon={User} title="Personal Information" />
        <div className="space-y-5">
          {/* Email read-only */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Email address</label>
            <p className="w-full border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground bg-cream min-h-[44px] flex items-center">
              {defaultValues.email}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Contact support to change your email</p>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-ink mb-1.5">First name</label>
              <input id="firstName" type="text" autoComplete="given-name" placeholder="Thabo" className={inputCls} {...register('firstName')} />
              {errors.firstName && <p className="mt-1.5 text-sm text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-ink mb-1.5">Last name</label>
              <input id="lastName" type="text" autoComplete="family-name" placeholder="Mokoena" className={inputCls} {...register('lastName')} />
              {errors.lastName && <p className="mt-1.5 text-sm text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-ink mb-1.5">
              About you <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              id="bio"
              rows={3}
              placeholder="A short note about yourself, your goals, or what you're working on…"
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              {...register('bio')}
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">{bio.length}/300</p>
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────── */}
      <section>
        <SectionHeading icon={Phone} title="Contact Details" />
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">
                Phone <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input id="phone" type="tel" autoComplete="tel" placeholder="+27 82 000 0000" className={inputCls} {...register('phone')} />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-ink mb-1.5">
                WhatsApp <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input id="whatsapp" type="tel" placeholder="+27 82 000 0000" className={inputCls} {...register('whatsapp')} />
              <p className="mt-1 text-xs text-muted-foreground">Used for session reminders</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Academic Profile ─────────────────────────────────────────────── */}
      <section>
        <SectionHeading icon={GraduationCap} title="Academic Profile" />
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="academicLevel" className="block text-sm font-medium text-ink mb-1.5">Academic level</label>
              <div className="relative">
                <select
                  id="academicLevel"
                  className="w-full border border-border rounded-xl px-4 py-3 pr-10 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] appearance-none"
                  {...register('academicLevel')}
                >
                  <option value="">Select your level</option>
                  {ACADEMIC_LEVELS.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-ink mb-1.5">
                School / University <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="school"
                type="text"
                placeholder="e.g. Eduvos, Wits, UCT"
                className={inputCls}
                {...register('school')}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subjects" className="block text-sm font-medium text-ink mb-1.5">
              Subjects you need help with <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="subjects"
              type="text"
              placeholder="e.g. Statistics, Probability, Data Analysis"
              className={inputCls}
              {...register('subjects')}
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {COMMON_SUBJECTS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    const current = (document.getElementById('subjects') as HTMLInputElement)?.value ?? ''
                    const list = current.split(',').map(x => x.trim()).filter(Boolean)
                    if (!list.includes(s)) {
                      const next = [...list, s].join(', ')
                      ;(document.getElementById('subjects') as HTMLInputElement).value = next
                    }
                  }}
                  className="text-xs bg-cream border border-border text-muted-foreground rounded-full px-2.5 py-1 hover:border-navy hover:text-navy transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Notifications ────────────────────────────────────────────────── */}
      <section>
        <SectionHeading icon={Bell} title="Notifications" />
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded border-border text-gold focus:ring-gold"
            {...register('marketingOptin')}
          />
          <div>
            <p className="text-sm font-medium text-ink">Study tips & offers</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receive exam prep tips, session specials, and study resources from Mdubusi Statistics.
            </p>
          </div>
        </label>
      </section>

      {/* Save button */}
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
