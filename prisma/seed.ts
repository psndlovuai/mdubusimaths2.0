import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const tutorEmail = process.env.TUTOR_EMAIL ?? 'tutor@mdubusimaths.com'
  const tutorPassword = process.env.TUTOR_INITIAL_PASSWORD ?? 'ChangeMe123!'

  const existing = await prisma.user.findUnique({ where: { email: tutorEmail } })
  if (!existing) {
    await prisma.user.create({
      data: {
        email: tutorEmail,
        password: await bcrypt.hash(tutorPassword, 12),
        firstName: 'PS',
        lastName: 'Ndlovu',
        role: 'TUTOR',
      },
    })
    console.log(`✅ Tutor account created: ${tutorEmail}`)
  } else {
    console.log(`ℹ️  Tutor account already exists: ${tutorEmail}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
