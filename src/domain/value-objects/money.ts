export class Money {
  private constructor(
    public readonly cents: number,
    public readonly currency: 'ZAR',
  ) {}

  static zar(rands: number): Money {
    if (!Number.isFinite(rands) || rands < 0) throw new Error('Invalid amount')
    return new Money(Math.round(rands * 100), 'ZAR')
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0) throw new Error('Invalid cents')
    return new Money(cents, 'ZAR')
  }

  format(): string {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' })
      .format(this.cents / 100)
  }
}
