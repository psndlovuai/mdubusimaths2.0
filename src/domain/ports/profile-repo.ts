export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  academicLevel?: string | null
  phone?: string | null
}

export interface IProfileRepo {
  updateById(userId: string, data: UpdateProfileData): Promise<void>
}
