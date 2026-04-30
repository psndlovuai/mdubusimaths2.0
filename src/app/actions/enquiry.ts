'use server'

import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  name:    z.string().min(2,  'Name must be at least 2 characters'),
  email:   z.string().email(  'Please enter a valid email address'),
  phone:   z.string().optional(),
  subject: z.string().min(3,  'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type EnquiryInput = z.infer<typeof schema>

export async function submitEnquiry(
  data: unknown,
): Promise<{ success?: true; error?: string }> {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { name, email, phone, subject, message } = parsed.data

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'hello@mdubusistats.com',
      to:      'info@mdubusistats.com',
      replyTo: email,
      subject: `Enquiry: ${subject}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1B3A6B;padding:24px 32px;border-radius:12px 12px 0 0">
            <p style="color:#fff;font-weight:700;font-size:18px;margin:0">Mdubusi Statistics</p>
            <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:4px 0 0">New website enquiry</p>
          </div>
          <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <h2 style="color:#1B3A6B;margin:0 0 20px">New Enquiry</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;width:90px">Name</td>
                <td style="padding:8px 0;color:#1a1a1a;font-weight:600">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px">Email</td>
                <td style="padding:8px 0"><a href="mailto:${email}" style="color:#1B3A6B">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding:8px 0;color:#888;font-size:13px">Phone</td>
                <td style="padding:8px 0;color:#1a1a1a">${phone}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px">Subject</td>
                <td style="padding:8px 0;color:#1a1a1a;font-weight:600">${subject}</td>
              </tr>
            </table>
            <div style="background:#F8F4EA;border-radius:8px;padding:16px 20px">
              <p style="color:#888;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px">Message</p>
              <p style="color:#1a1a1a;line-height:1.65;margin:0;white-space:pre-wrap">${message}</p>
            </div>
            <p style="color:#aaa;font-size:12px;margin:24px 0 0">
              Reply to this email to respond directly to ${name}.
            </p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch {
    return { error: 'Failed to send your enquiry. Please try again or email us directly.' }
  }
}
