"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2} from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SignupData {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  timezoneId: string
  phone?: string
}

interface TimezoneResponse {
  timezone?: string
}

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  // Function to get timezone
  const getTimezone = async (): Promise<string> => {
    try {
      const response = await fetch('http://ip-api.com/json/78.172.217.23?fields=57603&lang=en')
      if (response.ok) {
        const data: TimezoneResponse = await response.json()
        return data.timezone || 'Asia/Riyadh'
      }
    } catch (error) {
      console.error('Error fetching timezone:', error)
    }
    return 'Asia/Riyadh' // Default fallback
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!formData.password || !formData.firstName || 
        !formData.lastName || !formData.email) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      // Get timezone
      const timezoneId = await getTimezone()
      
      // Prepare signup data - use email as username
      const signupData: SignupData = {
        username: formData.email.split('@')[0], // Use email as username
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        timezoneId,
        ...(formData.phone && { phone: formData.phone })
      }

      // Make API call to our internal API route
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      })

      if (response.ok) {
        // Show success modal
        setShowSuccessModal(true)
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Signup failed' }))
        console.error('Signup error:', errorData)
        setError(errorData.error || 'Signup failed. Please try again.')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during signup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Enter your information to create your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name<span className="text-red-500">*</span></Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name<span className="text-red-500">*</span></Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+1234567890" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password<span className="text-red-500">*</span></Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password<span className="text-red-500">*</span></Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </CardContent>
          </form>
          <CardFooter>
            <div className="text-sm text-muted-foreground text-center w-full">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog  open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="shadow shadow-green-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="h-5 w-5 me-2 text-emerald-600" /> Account Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Your account has been created successfully. You will be redirected to the login page in a few seconds.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-center">
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            >
              Go to Login now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
