"use client"

import { useUser } from "@/contexts/user-provider"
import { EmailVerificationAlert } from "@/components/email-verification-alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"

export default function ProfilePage() {
  const { profile, loading } = useUser()

  if (loading) {
    return (
      <div>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your personal details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={profile.firstName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={profile.lastName} readOnly />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="flex">
                <Input value={profile.email} readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex">
                <Input value={profile.phone || "Not provided"} readOnly />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <div className="flex">
              <Input value={profile.timezoneId || "UTC"} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

