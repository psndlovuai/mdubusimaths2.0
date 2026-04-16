import type { IProfileRepo, UpdateProfileData } from '@/domain/ports/profile-repo'

export interface UpdateProfileInput {
  userId: string
  data: {
    firstName?: string
    lastName?: string
    academicLevel?: string | null
    phone?: string | null
  }
}

export class UpdateProfile {
  constructor(private readonly profileRepo: IProfileRepo) {}

  async execute(input: UpdateProfileInput): Promise<void> {
    const update: UpdateProfileData = {}

    if (input.data.firstName  !== undefined) update.firstName    = input.data.firstName
    if (input.data.lastName   !== undefined) update.lastName     = input.data.lastName
    if (input.data.academicLevel !== undefined) update.academicLevel = input.data.academicLevel
    if (input.data.phone      !== undefined) update.phone        = input.data.phone

    await this.profileRepo.updateById(input.userId, update)
  }
}
