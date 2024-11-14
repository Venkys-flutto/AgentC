import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Store data in session or pass it through URL
    const response = await fetch('http://62.72.30.10:5500/datacollector', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to send data to external API')
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to process data' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Please use POST method to submit quiz data' },
    { status: 405 }
  )
  
} 