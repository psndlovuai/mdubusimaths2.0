import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_APP_URL:        z.string().url(),
  DATABASE_URL:               z.string().min(20),
  AUTH_SECRET:                z.string().min(20),
  AUTH_URL:                   z.string().url(),
  CAL_USERNAME:               z.string().min(1),
  CAL_EVENT_TYPE_ONCE_OFF:    z.string().min(1),
  CAL_EVENT_TYPE_MONTHLY:     z.string().min(1),
  CAL_EVENT_TYPE_GROUP:       z.string().min(1),
  CAL_WEBHOOK_SECRET:         z.string().min(16),
  RESEND_API_KEY:             z.string().startsWith('re_'),
  RESEND_FROM_EMAIL:          z.string().email(),
  RESEND_REPLY_TO:            z.string().email(),
  TUTOR_EMAIL:                z.string().email(),
})

export const env = schema.parse(process.env)
