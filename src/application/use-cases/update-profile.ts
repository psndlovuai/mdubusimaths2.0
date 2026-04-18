import type { IProfileRepo, UpdateProfileData } from '@/domain/ports/profile-repo'

export interface UpdateProfileInput {
  userId: string
  data: {
    firstName?:      string
    lastName?:       string
    academicLevel?:  string | null
    school?:         string | null
    subjects?:       string | null
    phone?:          string | null
    whatsapp?:       string | null
    bio?:            string | null
    marketingOptin?: boolean
  }
}

export class UpdateProfile {
  constructor(private readonly profileRepo: IProfileRepo) {}

  async execute(input: UpdateProfileInput): Promise<void> {
    const update: UpdateProfileData = {}
    const d = input.data

    if (d.firstName      !== undefined) update.firstName      = d.firstName
    if (d.lastName       !== undefined) update.lastName       = d.lastName
    if (d.academicLevel  !== undefined) update.academicLevel  = d.academicLevel
    if (d.school         !== undefined) update.school         = d.school
    if (d.subjects       !== undefined) update.subjects       = d.subjects
    if (d.phone          !== undefined) update.phone          = d.phone
    if (d.whatsapp       !== undefined) update.whatsapp       = d.whatsapp
    if (d.bio            !== undefined) update.bio            = d.bio
    if (d.marketingOptin !== undefined) update.marketingOptin = d.marketingOptin

    await this.profileRepo.updateById(input.userId, update)
  }
}
