'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export default function QuizResults() {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const requestData = sessionStorage.getItem('quizRequest')
        if (!requestData) {
          throw new Error('No quiz data found')
        }

        const response = await fetch('https://flutto.ai/datacollector', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestData
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseData = await response.json()
        const actualResponse = responseData?.response?.response || responseData?.response || responseData
        setResponse(actualResponse)
        sessionStorage.setItem('quizResponse', JSON.stringify(responseData))
      } catch (error) {
        console.error('Error fetching results:', error)
        setResponse('Error loading response. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (isLoading || !response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
        <Card className="w-96 shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-700">Hold on, excellence is being prepared for you!.....</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
            <CardTitle className="text-2xl text-center text-primary">Flutto AI</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="mb-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                {/* Markdown Renderer */}
                <ReactMarkdown
                  className="text-gray-700 leading-relaxed"
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                    p: ({ children }) => <p className="mb-4">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 rounded p-4 overflow-x-auto mb-4">{children}</pre>
                    ),
                  }}
                >
                  {response}
                </ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            onClick={() => router.push('/initialquiz')}
            variant="outline"
            className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
          >
            Learn another topic
          </Button>
          <Button
            onClick={() => {
              const blob = new Blob([response], { type: 'text/markdown' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'learning-path.md'
              a.click()
            }}
            className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
          >
            Save as Markdown
          </Button>
        </div>
      </div>
    </div>
  )
} 