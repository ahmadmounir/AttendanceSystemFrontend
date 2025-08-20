"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-provider"

type LoginRequest = {
  username: string
  password: string
  tenantId?: string
}

type LoginResponse = {
  tenantId: string
  tenantName: string
  username: string
  email: string
  name: string
  role: string
  accessToken: string
}

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [tenantId, setTenantId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setLoginData } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const loginData: LoginRequest = {
        username,
        password,
        ...(tenantId && { tenantId })
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => "Login failed")
        setError(errorData.error || "Login failed")
        return
      }

      const userData: LoginResponse = await response.json()
      
      // Store the login data in context for immediate use
      setLoginData(userData)
      
      // The access token is automatically stored in httpOnly cookie by the API route
      // Redirect to home page
      router.push("/")
    } catch (err) {
      setError("Internal Error: " + err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter your email" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                placeholder="Enter your password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2 hidden">
              <Label htmlFor="tenantId">Tenant ID (Optional)</Label>
              <Input 
                id="tenantId" 
                type="text" 
                placeholder="Enter tenant ID (optional)" 
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <Link
            href="/auth/reset-password"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
