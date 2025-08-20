"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { useUser } from "@/contexts/user-provider"
import {
  User,
  Edit,
  Shield,
  ShieldAlert,
  RefreshCw,
} from "lucide-react"

export default function ProfilePage() {
  const { profile, loading, error, refreshProfile } = useUser()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  // Force refresh profile data when the component mounts
  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardHeader>
          </Card>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading profile: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const displayName = `${profile.firstName} ${profile.lastName}`.trim()
  const initials = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refreshProfile()}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1 ">
          <Card className="sticky top-5">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/avatars/user.png" alt={displayName} />
                  <AvatarFallback className="text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{displayName}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
              <div className="flex justify-center pt-2">
                <Badge variant="outline">{profile.tenantName || "No Tenant"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>1 workspace</span>
              </div> */}
              {/* <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Location not set</span>
              </div> */}
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
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
                    <Input value={profile.phone || "-"} readOnly />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <div className="flex">
                    <Input value={profile.timezoneId || "-"} readOnly />
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Workspace Access */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Workspace Access
              </CardTitle>
              <CardDescription>
                Workspaces you have access to and your role in each.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                      {profile.tenantName?.charAt(0) || "T"}
                    </div>
                    <div>
                      <p className="font-medium">{profile.tenantName || "Default Workspace"}</p>
                      <p className="text-sm text-muted-foreground">
                        Member
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    Member
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card> */}

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
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-md text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </CardContent>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-md text-muted-foreground">&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</p>
                  </div>
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
          {!profile.emailVerified && (
          <Card className="">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="h-5 w-5 text-orange-500" />
                  Email Not Verified
                </CardTitle>
                <CardDescription>
                  Your email address has not been verified yet.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Send Verification Email
              </Button>
            </CardHeader>
          </Card>
          )}
        </div>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog 
        open={isChangePasswordOpen} 
        onOpenChange={setIsChangePasswordOpen} 
      />
    </div>
  )
}
