import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test the connection with a simple query
    await prisma.$connect()
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'Connected',
      message: 'Successfully connected to the database',
      userCount: userCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      status: 'Error',
      message: 'Failed to connect to the database',
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 