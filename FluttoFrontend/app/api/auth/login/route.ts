import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"

// Define validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json()
    console.log('Login attempt for:', body.email)

    // Validate entire body at once instead of separately
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    // Add console.log for debugging
    console.log('Received login attempt for:', email)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
        select: {
        id: true,
        email: true,
        hashedPassword: true,
        name: true,
      },
    })

    console.log('Login API - Found user:', user)

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Return user data (excluding password)
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name
    }
    
    console.log('Login API - Sending response:', userWithoutPassword)
    return new NextResponse(
      JSON.stringify({
        user: userWithoutPassword,
        message: "Login successful"
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error("Login error:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An error occurred during login" 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
} 