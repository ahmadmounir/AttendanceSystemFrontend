"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { useUser } from "@/contexts/user-provider"
import { EmailVerificationAlert } from "@/components/email-verification-alert"
import { Shield } from "lucide-react"

export default function ProfilePage() {
  const { profile, loading } = useUser()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">Unable to load profile data</div>
        </div>
      </div>
    )
  }

  return (
    <div>

      {/* Email Verification Alert */}
      {!profile.emailVerified && (
        <EmailVerificationAlert />
      )}

            {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">••••••••••••</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsChangePasswordOpen(true)}
            >
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <ChangePasswordDialog 
        open={isChangePasswordOpen} 
        onOpenChange={setIsChangePasswordOpen} 
      />
    </div>
  )
}

