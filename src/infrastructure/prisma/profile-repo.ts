import type { IProfileRepo, UpdateProfileData } from '@/domain/ports/profile-repo'
import { prisma } from './client'

export class PrismaProfileRepo implements IProfileRepo {
  async updateById(userId: string, data: UpdateProfileData): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.firstName      !== undefined && { firstName:      data.firstName }),
        ...(data.lastName       !== undefined && { lastName:       data.lastName }),
        ...(data.academicLevel  !== undefined && { academicLevel:  data.academicLevel }),
        ...(data.school         !== undefined && { school:         data.school }),
        ...(data.subjects       !== undefined && { subjects:       data.subjects }),
        ...(data.preferredMode  !== undefined && { preferredMode:  data.preferredMode }),
        ...(data.location       !== undefined && { location:       data.location }),
        ...(data.phone          !== undefined && { phone:          data.phone }),
        ...(data.whatsapp       !== undefined && { whatsapp:       data.whatsapp }),
        ...(data.bio            !== undefined && { bio:            data.bio }),
        ...(data.marketingOptin !== undefined && { marketingOptin: data.marketingOptin }),
      },
    })
  }
}
