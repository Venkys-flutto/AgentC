import { NextResponse } from 'next/server'

interface Parameter {
  question: string
  userAnswer: string
}

interface QuizResults {
  prompt: string
  PersonalParameters: Parameter[]
  ObjectiveParameters: Parameter[]
  DomainParameters: Parameter[]
}

export async function POST(request: Request) {
  try {
    const data: QuizResults = await request.json()

    //display the data received
    // Format the parameters for display
    
    const formattedData = {
      prompt: data.prompt,
      PersonalParameters: data.PersonalParameters.map(param => ({
        question: param.question,
        answer: param.userAnswer
      })),
      ObjectiveParameters: data.ObjectiveParameters.map(param => ({
        question: param.question,
        answer: param.userAnswer
      })),
      DomainParameters: data.DomainParameters.map(param => ({
        question: param.question,
        answer: param.userAnswer
        })) 
    }


    return NextResponse.json(formattedData, { status: 200 })
  } catch (error) {
    console.error('Error processing quiz data:', error)
    return NextResponse.json(
      { error: 'Failed to process quiz data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Please use POST method to submit quiz data' },
    { status: 405 }
  )
  
} 