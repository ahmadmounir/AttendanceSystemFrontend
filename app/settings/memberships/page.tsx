"use client"

import { useUser } from "@/contexts/user-provider"
import { MembershipsTab } from "../memberships-tab"
import { EmailVerificationAlert } from "@/components/email-verification-alert"

export default function MembershipsPage() {
  const { profile, loading } = useUser()

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading memberships...</p>
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
    <div >

      {/* Email Verification Alert */}
      {!profile.emailVerified && (
        <EmailVerificationAlert />
      )}

      {/* Memberships Content */}
      <MembershipsTab profile={profile} />
    </div>
  )
}

