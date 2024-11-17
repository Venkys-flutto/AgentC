'use client'
import { useState } from 'react'
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

// Create a client component that uses useSearchParams
function LoginContent() {
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

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
    setError(null)
    setIsLoading(prev => ({ ...prev, email: true }))

    const formData = new FormData(e.target as HTMLFormElement)
    
    const loginData = {
      email: formData.get('email'),
      password: formData.get('password'),
    }
    
    console.log('Login Page - Sending login data:', loginData)
    
    try {
      // First verify credentials with our API
      const verifyResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await verifyResponse.json()
      console.log('Login Page - Received API response:', data)

      if (!verifyResponse.ok) {
        setError(data.error)
        return
      }

      // If verification successful, create session with NextAuth
      const signInResponse = await signIn('credentials', {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      })
      
      console.log('Login Page - NextAuth response:', signInResponse)

      if (signInResponse?.error) {
        setError('Session creation failed')
      } else {
        const callbackUrl = searchParams.get('callbackUrl') || '/'
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent-purple/5 to-accent-pink/5">
      <div className="container flex flex-col items-center justify-center min-h-screen py-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center mb-8 text-primary">
          <Cpu className="h-6 w-6 mr-2" />{/* Logo */}
          <span className="font-bold text-xl">Flutto Ai</span>
        </Link>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/20 dark:border-gray-700/20 transition-all duration-300 rounded-xl overflow-hidden group ">

            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-purple to-accent-pink">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Choose your preferred login method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isLoading['google']}
                >
                  {isLoading['google'] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
                {/* <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleOAuthSignIn('azure-ad')}
                  disabled={isLoading['azure-ad']}
                >
                  {isLoading['azure-ad'] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
                        <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                      Continue with Microsoft
                    </>
                  )}
                </Button> */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={isLoading['github']}
                >
                  {isLoading['github'] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      Continue with GitHub
                    </>
                  )}
                </Button>
                {/* <Button 
  variant="outline" 
  className="w-full"
  onClick={() => handleOAuthSignIn('linkedin')}
  disabled={isLoading['linkedin']}
>
  {isLoading['linkedin'] ? (
    <span className="flex items-center">
      <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Signing in...
    </span>
  ) : (
    <>
      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
      Continue with LinkedIn
    </>
                  )}
                </Button> */}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary dark:text-white">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    placeholder="name@example.com" 
                    type="email" 
                    required 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-primary dark:text-white">Password</Label>
                    <Button variant="link" className="px-0 font-normal text-xs text-primary">
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    required 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 hover:border-primary/50"
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading['email']}>
                  {isLoading['email'] ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                </span>
                <Link 
                  href="/signup" 
                  className="text-primary hover:underline"
                >
                  Sign up 
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Main page component
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
} 
