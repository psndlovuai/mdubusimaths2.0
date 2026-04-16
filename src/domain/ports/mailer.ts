export interface IMailer {
  send(input: {
    to: string
    templateId: 'welcome' | 'booking-confirmation' | 'tutor-new-booking-alert'
    props: Record<string, unknown>
  }): Promise<void>
}
