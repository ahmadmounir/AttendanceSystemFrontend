"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

type ResetPasswordRequest = {
  address: string
}

type ResetPasswordVerifyRequest = {
  address: string
  code: string
}

type ResetPasswordCommitRequest = {
  token: string
  newPassword: string
}

export default function ResetPasswordBeginPage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [error, setError] = useState("")
  const [verifyError, setVerifyError] = useState("")
  const [resetError, setResetError] = useState("")
  const [success, setSuccess] = useState(false)
  const [verified, setVerified] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const [resetComplete, setResetComplete] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const resetData: ResetPasswordRequest = {
        address: email
      }

      const response = await fetch("/api/auth/reset-password/begin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to send reset email")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifyLoading(true)
    setVerifyError("")

    try {
      const verifyData: ResetPasswordVerifyRequest = {
        address: email,
        code: code
      }

      const response = await fetch("/api/auth/reset-password/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to verify code")
      }

      const data = await response.json()
      setResetToken(data.token) // Store the token from response
      setVerified(true)
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setResetError("")

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match")
      setResetLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters long")
      setResetLoading(false)
      return
    }

    try {
      const resetData: ResetPasswordCommitRequest = {
        token: resetToken,
        newPassword: newPassword
      }

      const response = await fetch("/api/auth/reset-password/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reset password")
      }

      setResetComplete(true)
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setResetLoading(false)
    }
  }

  const handleTryAgain = () => {
    setSuccess(false)
    setCode("")
    setVerifyError("")
    setError("")
  }

  if (success && !verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a verification code to your email address
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerify}>
            <CardContent className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Check your email <strong>{email}</strong> for the verification code
                </p>
              </div>
              {verifyError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {verifyError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input 
                  id="code" 
                  type="text" 
                  placeholder="Enter verification code" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required 
                />
              </div>
              <Button className="w-full" type="submit" disabled={verifyLoading}>
                {verifyLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Didn&apos;t receive the code?{" "}
              <button 
                type="button"
                onClick={() => handleTryAgain()}
                className="text-primary hover:underline bg-transparent border-none p-0"
              >
                Try again
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (verified && !resetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {resetError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {resetError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder="Enter new password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              <Button className="w-full" type="submit" disabled={resetLoading}>
                {resetLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    )
  }

  if (resetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Password Reset Successful</CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" onClick={() => {
              window.location.href = "/auth/login"
            }}>
              Go to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email and we&apos;ll send you a verification code
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Email"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            <Link href="/auth/login" className="text-primary hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
