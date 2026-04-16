export class TimeSlot {
  constructor(
    public readonly start: Date,
    public readonly end: Date,
  ) {
    if (end <= start) throw new Error('TimeSlot end must be after start')
  }

  get durationMinutes(): number {
    return Math.round((this.end.getTime() - this.start.getTime()) / 60000)
  }

  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && other.start < this.end
  }
}
