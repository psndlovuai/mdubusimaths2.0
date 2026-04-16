// Shared type definitions — extend as phases progress

export type Role = 'STUDENT' | 'TUTOR'

export type SessionStatus = 'confirmed' | 'cancelled' | 'completed'

export type SessionTypeValue = 'once_off' | 'monthly' | 'group'

export interface NavItem {
  label: string
  href: string
  icon?: string
}
