import { container } from '@/infrastructure/container'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Students' }

const LEVEL_LABELS: Record<string, string> = {
  grade_11:      'Grade 11',
  grade_12:      'Grade 12',
  undergraduate: 'Undergraduate',
  honours:       'Honours',
  postgraduate:  'Postgraduate',
  professional:  'Professional',
}

export default async function TutorStudentsPage() {
  const c        = container()
  const students = await c.listStudents.execute()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">Students</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {students.length} student{students.length !== 1 ? 's' : ''} registered
        </p>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-10 text-center text-muted-foreground text-sm">
          No students yet. Students are created automatically when a booking is received.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {students.map(student => (
            <article key={student.id} className="bg-white rounded-xl shadow-card p-5 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-ink truncate">{student.fullName}</p>
                  {student.academicLevel && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {LEVEL_LABELS[student.academicLevel] ?? student.academicLevel}
                    </p>
                  )}
                </div>
                {/* Session count badge */}
                <span
                  className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-navy/10 text-navy font-bold text-sm"
                  title={`${student.totalSessions ?? 0} sessions`}
                >
                  {student.totalSessions ?? 0}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${student.email}`}
                  className="truncate hover:text-ink transition-colors"
                >
                  {student.email}
                </a>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {student.totalSessions ?? 0} session{(student.totalSessions ?? 0) !== 1 ? 's' : ''}
                </span>
                <Link
                  href={`/tutor/bookings?student=${encodeURIComponent(student.fullName)}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  View sessions →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
