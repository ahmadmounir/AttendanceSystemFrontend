"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-provider"
import { RefreshCw, User, Users, Shield } from "lucide-react"
import { EmailVerificationAlert } from "@/components/email-verification-alert"
import Link from "next/link"

export default function SettingsPage() {
  const { profile, loading, error, refreshProfile } = useUser()

  // Force refresh profile data when the component mounts
  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Settings</CardTitle>
            <CardDescription className="text-red-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refreshProfile()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div>

      {/* Email Verification Alert */}
      {!profile.emailVerified && (
        <EmailVerificationAlert />
      )}

      {/* Quick Access Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/settings/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Profile</CardTitle>
                  <CardDescription>Personal information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your personal details, contact information, and account settings.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/memberships">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Memberships</CardTitle>
                  <CardDescription>Organizations & teams</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your memberships across different organizations and teams.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/security">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription>Password & authentication</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your password and manage security settings.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Account Summary */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>
              Quick overview of your account status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organization</p>
                <p className="text-base">{profile.tenantName || profile.tenantId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">{`${profile.firstName} ${profile.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email Status</p>
                <p className={`text-base ${profile.emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
                  {profile.emailVerified ? '✓ Verified' : '⚠ Not Verified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
