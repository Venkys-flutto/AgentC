'use client'
import { useState } from 'react'
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }))
    try {
      await signIn(provider, {
        callbackUrl: '/',
      })
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(prev => ({ ...prev, email: true }))
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed')
      }

      // If signup successful, sign in
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      // Redirect on success
      window.location.href = '/'

    } catch (error) {
      console.error('Signup error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent-purple/5 to-accent-pink/5">
      <div className="container flex flex-col items-center justify-center min-h-screen py-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center mb-8 text-primary">
          <Cpu className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">Flutto Ai</span>
        </Link>

        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/20 dark:border-gray-700/20 transition-all duration-300 rounded-xl overflow-hidden group">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-purple to-accent-pink">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary dark:text-white">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary dark:text-white">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-primary dark:text-white">Password</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-primary dark:text-white">Confirm Password</Label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white" 
                  type="submit" 
                  disabled={isLoading['email']}
                >
                  {isLoading['email'] ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                </span>
                <Link 
                  href="/login" 
                  className="text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 