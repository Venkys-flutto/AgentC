import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { isFirstLogin: true }
    })

    return NextResponse.json({ isFirstLogin: user?.isFirstLogin ?? false })
  } catch (error) {
    console.error('Check first login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 