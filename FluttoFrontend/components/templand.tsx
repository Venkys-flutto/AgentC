'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, HeadphonesIcon, GraduationCap, Users, Globe, Cpu, Menu } from "lucide-react" 
import Link from "next/link"
//import { Label } from "@/components/ui/label"
import { useSession } from 'next-auth/react'
import { ProfileMenu } from "@/components/ui/profile-menu"
import { useRouter } from 'next/navigation'



export default function LandingPage() {
  const { data: session } = useSession()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen"> {/* min-h-screen is used to ensure that the page is at least the height of the screen */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Cpu className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-lg">Flutto Ai</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4 pt-3 " href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 pt-3" href="#benefits">
            Benefits
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 pt-3" href="#contact">
            Contact
          </Link>
          {session?.user ? (
            <ProfileMenu />
          ) : (
            <div className="flex justify-center text-gray-600">
            <Button variant="outline"  size="sm" className="w-full" onClick={() => router.push('/login')}>
              Login
            </Button>
            </div>
          )}
        </nav>
        <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <Menu className="h-5 w-5" />
        </Button>
      </header>
      {showMobileMenu && (
        <nav className="md:hidden absolute right-0 top-14 w-64 bg-black backdrop-blur-md shadow-lg border-l border-b border-gray-100 z-50">
          <div className="p-4 space-y-2 flex flex-col items-end">
            <Link className="block text-sm font-medium hover:underline underline-offset-4" href="#features">
              Features
            </Link>
            <Link className="block text-sm font-medium hover:underline underline-offset-4" href="#benefits">
              Benefits
            </Link>
            <Link className="block text-sm font-medium hover:underline underline-offset-4" href="#contact">
              Contact
            </Link>
            {session?.user ? (
              <div className="flex justify-end w-full">
                <ProfileMenu />
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => router.push('/login')} className="w-full">
                Login
              </Button>
            )}
          </div>
        </nav>
      )}
      <main className="flex-1 min-h-screen">
        <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center ">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100 animate-fade-in px-4 md:px-[100px]">
                  Revolutionize Your Business Operations with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-base sm:text-lg md:text-xl text-gray-100 animate-fade-in-up px-4">
                  Flutto Ai Services: AI-powered content generation and support platform for documentation, customer support, and employee training.
                </p>
              </div>
              <div className="space-x-4 animate-fade-in-up delay-200">
                <Button 
                  size="lg" 
                  variant="default" 
                  className="bg-secondary hover:bg-secondary-foreground hover:scale-105 transition-transform text-white"
                  onClick={() => {
                    if (session?.user) {
                      router.push('/initialquiz')
                    } else {
                      router.push('/login')
                    }
                  }}
                >
                  Get Started
                </Button>
                
                {/* <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:scale-105 transition-transform"
                  onClick={() => router.push('/login')}
                >
                  Learn More
                </Button> */}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-8 md:py-16 lg:py-24 w-full bg-gradient-to-b from-background to-gray-50 dark:from-background-dark dark:to-gray-900">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-purple to-accent-pink px-4">
              Comprehensive AI Solutions
            </h2>
            <Tabs defaultValue="documentation" className="w-full px-4 md:px-[100px]">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4 overflow-x-auto">
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="support">L0 Support</TabsTrigger>
                <TabsTrigger value="upskilling">Employee Upskilling</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                <TabsTrigger value="global">Global Support</TabsTrigger>
                <TabsTrigger value="automation">Automation & AI</TabsTrigger>
              </TabsList>
              <TabsContent value="documentation">
                <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>AI-Powered Documentation</CardTitle>
                    <CardDescription>Streamline your product documentation process</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Automate documentation creation, reducing time and resources</p>
                    <p>• Ensure consistency across versions and product lines</p>
                    <p>• Multi-language support for global accessibility</p>
                    <p>• Generate engaging multimedia content automatically</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="support">
                <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>Intelligent L0 Support</CardTitle>
                    <CardDescription>Enhance customer support efficiency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Handle high volumes of routine queries automatically</p>
                    <p>• Provide consistent multi-channel support</p>
                    <p>• Enable 24/7 customer support without human intervention</p>
                    <p>• Intelligent escalation for complex issues</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="upskilling">
                <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>Dynamic Employee Upskilling</CardTitle>
                    <CardDescription>Accelerate employee growth and development</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Rapidly create and update training programs</p>
                    <p>• Personalize learning paths for individual needs</p>
                    <p>• Track and measure training effectiveness</p>
                    <p>• Increase engagement with interactive content</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="collaboration">
                <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>Seamless Collaboration</CardTitle>
                    <CardDescription>Enhance team productivity and content management</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Enable efficient multi-author collaboration</p>
                    <p>• Integrate with various CMS platforms</p>
                    <p>• Utilize data-driven insights for content improvement</p>
                    <p>• Streamline version control and content updates</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="global">
                <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>Global Multi-Channel Support</CardTitle>
                    <CardDescription>Deliver consistent experiences worldwide</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Manage multi-language documentation and support efficiently</p>
                    <p>• Ensure consistent content across all devices</p>
                    <p>• Boost engagement across multiple communication channels</p>
                    <p>• Provide seamless support experiences globally</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="automation">
                <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>Advanced Automation & AI</CardTitle>
                    <CardDescription>Leverage cutting-edge technology for business growth</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Automate routine tasks for increased efficiency</p>
                    <p>• Implement proactive issue resolution with AI-driven insights</p>
                    <p>• Continuously improve processes with machine learning</p>
                    <p>• Enhance decision-making with predictive analytics</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="benefits" className="w-full py-8 md:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-background dark:from-gray-900 dark:to-background-dark">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-teal to-secondary">
              Key Benefits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-4 md:px-[100px]">
              <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="h-8 w-8 mb-2 text-accent-purple" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Enhanced Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  Streamline creation of accurate, consistent, and multilingual product documentation.
                </CardContent>
              </Card>
              <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <HeadphonesIcon className="h-8 w-8 mb-2 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Improved Customer Support</CardTitle>
                </CardHeader>
                <CardContent>
                  Provide 24/7 intelligent support across multiple channels, reducing response times.
                </CardContent>
              </Card>
              <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <GraduationCap className="h-8 w-8 mb-2 text-accent-teal" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Accelerated Employee Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  Deliver personalized, engaging training programs that adapt to individual needs.
                </CardContent>
              </Card>
              <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <Users className="h-8 w-8 mb-2 text-secondary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Enhanced Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  Facilitate seamless teamwork and efficient content management across departments.
                </CardContent>
              </Card>
              <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <Globe className="h-8 w-8 mb-2 text-accent-pink" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Global Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  Expand your market with consistent, multi-language support and documentation.
                </CardContent>
              </Card>
              <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <Cpu className="h-8 w-8 mb-2 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">AI-Driven Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  Leverage advanced AI to automate tasks and gain predictive insights for your business.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-8 md:py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-accent-purple/5 to-accent-pink/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-purple to-accent-pink px-4">
                  Ready to Transform Your Business?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Get in touch with us to see how Flutto Ai can revolutionize your operations.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 px-4">
                <form className="flex flex-col space-y-4">
                  <Input 
                    className="max-w-lg flex-1 transition-all duration-300 focus:ring-2 focus:ring-primary/50 hover:border-primary/50 bg-black/80 backdrop-blur-sm" 
                    placeholder="Your name" 
                    type="text" 
                  />
                  <Input 
                    className="max-w-lg flex-1 transition-all duration-300 focus:ring-2 focus:ring-primary/50 hover:border-primary/50 bg-black/80 backdrop-blur-sm" 
                    placeholder="Your email" 
                    type="email" 
                  />
                  <Button onClick={() => window.open("mailto:contact@flutto.ai", '_blank')} type="submit" className="w-full">Request Demo</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-4 md:py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gradient-to-r from-background to-gray-50 dark:from-background-dark dark:to-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Flutto Ai Services. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
