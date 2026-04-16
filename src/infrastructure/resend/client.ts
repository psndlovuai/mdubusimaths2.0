import { Resend } from 'resend'

// Lazily initialised so tests can run without RESEND_API_KEY
let _client: Resend | null = null

export function getResendClient(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY is not set')
    _client = new Resend(key)
  }
  return _client
}
