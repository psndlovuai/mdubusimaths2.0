export interface UpdateProfileData {
  firstName?:     string
  lastName?:      string
  academicLevel?: string | null
  school?:        string | null
  subjects?:      string | null
  phone?:         string | null
  whatsapp?:      string | null
  bio?:           string | null
  marketingOptin?: boolean
}

export interface IProfileRepo {
  updateById(userId: string, data: UpdateProfileData): Promise<void>
}
