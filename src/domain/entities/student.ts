export class Student {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly academicLevel: string | null,
    public readonly phone: string | null,
    public readonly createdAt: Date,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
