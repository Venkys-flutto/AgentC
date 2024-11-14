import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    console.log('Received signup request for:', email)

    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User already exists" }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        isFirstLogin: true
      },
    })

    console.log('Created user:', { id: user.id, email: user.email })

    return new NextResponse(
      JSON.stringify({
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isFirstLogin: user.isFirstLogin
        }
      }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error"
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
} 