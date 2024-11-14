import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Try to count users as a simple test
    const count = await prisma.user.count()
    return NextResponse.json({ message: 'Database connected', userCount: count })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
} 