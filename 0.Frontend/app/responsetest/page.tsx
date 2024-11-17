'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'github-markdown-css'
import '@/styles/markdown.css'
import { useSession } from 'next-auth/react'

import params from './params.json'

export default function QuizResults() {
  const [response, setResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const requestData = params
        if (!requestData) {
          throw new Error('No quiz data found')
        }

        setIsLoading(false)

        const response = await fetch('https://www.flutto.ai/datacollector/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify(requestData)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''

        if (!reader) {
          throw new Error('No reader available')
        }

        const processText = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()

              if (done) {
                if (buffer) {
                  try {
                    const jsonResponse = JSON.parse(buffer)
                    const markdownContent = jsonResponse.response.response || jsonResponse.response
                    setResponse(prev => prev + markdownContent)
                  } catch {
                    setResponse(prev => prev + buffer)
                  }
                }
                break
              }

              buffer += decoder.decode(value, { stream: true })

              const lines = buffer.split('\n')
              buffer = lines.pop() || ''

              if (lines.length > 0) {
                lines.forEach(line => {
                  try {
                    const jsonLine = JSON.parse(line)
                    const markdownContent = jsonLine.response.response || jsonLine.response
                    setResponse(prev => prev + markdownContent + '\n')
                  } catch {
                    setResponse(prev => prev + line + '\n')
                  }
                })
              }
            }
          } finally {
            reader.releaseLock()
          }
        }

        await processText()

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
            <div className="markdown-body bg-transparent">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  h1: ({ children, ...props }) => <h1 className="text-2xl font-bold my-4" {...props}>{children}</h1>,
                  h2: ({ children, ...props }) => <h2 className="text-xl font-bold my-3" {...props}>{children}</h2>,
                  h3: ({ children, ...props }) => <h3 className="text-lg font-bold my-2" {...props}>{children}</h3>,
                  p: ({ children, ...props }) => <p className="my-2" {...props}>{children}</p>,
                  ul: ({ children, ...props }) => <ul className="list-disc pl-6 my-2" {...props}>{children}</ul>,
                  ol: ({ children, ...props }) => <ol className="list-decimal pl-6 my-2" {...props}>{children}</ol>,
                  li: ({ children, ...props }) => <li className="my-1" {...props}>{children}</li>,
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <pre className="bg-gray-100 rounded-md p-4 my-4 overflow-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>
                        {children}
                      </code>
                    )
                  },
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic" {...props}>
                      {children}
                    </blockquote>
                  ),
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-gray-300" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children, ...props }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props}>
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td className="border border-gray-300 px-4 py-2" {...props}>
                      {children}
                    </td>
                  ),
                }}
              >
                {response}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            onClick={() => router.push('/initialquiz')}
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
