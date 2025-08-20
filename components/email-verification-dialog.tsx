"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUser } from "@/contexts/user-provider"
import toast from "react-hot-toast"

interface EmailVerificationDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailVerificationDialog({ isOpen, onClose }: EmailVerificationDialogProps) {
  const [code, setCode] = useState("")
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState("")
  const [showCodeInput, setShowCodeInput] = useState(false)
  const { profile, fetchProfile } = useUser()

  const handleSendVerificationEmail = async () => {
    try {
      const response = await fetch("/api/profile/verify-email/begin", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send verification email")
      }

      setShowCodeInput(true)
      toast.success("Verification email sent! Please check your inbox.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send verification email")
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifyLoading(true)
    setVerifyError("")

    try {
      const response = await fetch("/api/profile/verify-email/verify", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to verify code")
      }

      const data = await response.json()

      // Now commit the verification
      await handleCommitVerification(data.token)
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleCommitVerification = async (token: string) => {
    try {
      const response = await fetch("/api/profile/verify-email/commit", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to complete email verification")
      }

      // Success! Show toast and refresh user data
      toast.success("Email successfully verified!")
      await fetchProfile() // Refetch user data
      handleClose()
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Failed to complete verification")
    }
  }

  const handleClose = () => {
    setCode("")
    setVerifyError("")
    setShowCodeInput(false)
    onClose()
  }

  const handleTryAgain = () => {
    setShowCodeInput(false)
    setCode("")
    setVerifyError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!showCodeInput ? (
          <>
            <DialogHeader>
              <DialogTitle>Send Verification Email</DialogTitle>
              <DialogDescription>
                We&apos;ll send a verification code to your email address: <strong>{profile?.email}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSendVerificationEmail} className="flex-1">
                Send Email
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Enter Verification Code</DialogTitle>
              <DialogDescription>
                We&apos;ve sent a verification code to your email address
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyCode}>
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check your email <strong>{profile?.email}</strong> for the verification code
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
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleTryAgain}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={verifyLoading}
                    className="flex-1"
                  >
                    {verifyLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
