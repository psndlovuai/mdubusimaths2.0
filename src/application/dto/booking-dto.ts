// ─── Booking ──────────────────────────────────────────────────────────────────
export interface BookingDto {
  id: string
  studentId: string
  studentName?: string
  studentEmail?: string
  subject: string
  topic: string | null
  sessionType: string        // 'once_off' | 'monthly' | 'group'
  sessionTypeLabel: string   // human-readable label
  startTime: string          // ISO string (was scheduledAt)
  durationMin: number
  amountCents: number
  amountFormatted: string    // e.g. "R150,00"
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  calBookingUid: string | null
  createdAt: string
}

// ─── Student ──────────────────────────────────────────────────────────────────
export interface StudentDto {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  academicLevel: string | null
  phone: string | null
  totalSessions?: number
  lastSessionDate?: string | null  // ISO string
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────
export interface DashboardStatsDto {
  todayCount: number
  weekCount: number
  totalRevenueCents: number
  studentCount: number
}
