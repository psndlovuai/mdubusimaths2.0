import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { prisma } from '@/infrastructure/prisma/client'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  // Validate type and size (max 2 MB)
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image must be under 2 MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const blob = await put(`avatars/${session.user.id}.${ext}`, file, {
    access: 'public',
    addRandomSuffix: false,
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data:  { avatarUrl: blob.url },
  })

  return NextResponse.json({ url: blob.url })
}
