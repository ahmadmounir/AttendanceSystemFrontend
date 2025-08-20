import { useUser } from "@/contexts/user-provider"

export interface UserProfile {
  userId: string
  tenantId: string
  tenantName: string | null
  firstName: string
  lastName: string
  email: string
  phone: string | null
  timezoneId: string
  emailVerified: boolean
}

export function useUserProfile() {
  const { loginData, profile, loading, error } = useUser()
  
  // For backward compatibility, prefer actual profile data over login data
  // If no profile data available, create a profile-like object from login data
  const displayProfile = profile || (loginData ? {
    userId: loginData.username, // Use username as userId for now
    tenantId: loginData.tenantId,
    tenantName: loginData.tenantName,
    firstName: loginData.name.split(' ')[0] || '',
    lastName: loginData.name.split(' ').slice(1).join(' ') || '',
    email: loginData.email,
    phone: null,
    timezoneId: 'UTC', // Default timezone
    emailVerified: true, // Assume verified if they can login
  } : null)

  return { 
    profile: displayProfile, 
    loading, 
    error,
    loginData // Also expose login data for additional info like role
  }
}
