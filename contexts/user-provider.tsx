"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface LoginUserData {
  tenantId: string
  tenantName: string
  username: string
  email: string
  name: string
  role: string
  accessToken: string
}

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

interface UserContextType {
  loginData: LoginUserData | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  setLoginData: (data: LoginUserData | null) => void
  setProfile: (profile: UserProfile | null) => void
  fetchProfile: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [loginData, setLoginData] = useState<LoginUserData | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const router = useRouter()

  // Enhanced API fetcher with 401 handling
  const clientApiFetchWithAuth = React.useCallback(async <T,>(path: string): Promise<T> => {
    // Get token from cookie on client side
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=')
      acc[name] = value
      return acc
    }, {} as Record<string, string>)

    const token = cookies['access_token']
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(path, {
      headers,
    })

    if (response.status === 401) {
      // Clear user data and redirect to login
      setLoginData(null)
      setProfile(null)
      setError("Session expired. Please log in again.")
      
      // Only redirect if we're not already on a login page
      if (!window.location.pathname.startsWith('/auth/')) {
        router.push('/auth/login')
      }
      
      throw new Error('Unauthorized - redirecting to login')
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "")
      throw new Error(`${response.status} ${response.statusText} — ${text}`)
    }

    return response.json() as Promise<T>
  }, [router])

  const fetchProfile = React.useCallback(async () => {
    if (hasAttemptedFetch || loginData) {
      return // Don't fetch if we already have login data or already attempted
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await clientApiFetchWithAuth<UserProfile>("/api/profile/get")
      setProfile(data)
      setHasAttemptedFetch(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile")
      setHasAttemptedFetch(true)
    } finally {
      setLoading(false)
    }
  }, [hasAttemptedFetch, loginData, clientApiFetchWithAuth])

  // Force refresh profile from API (ignores cache)
  const refreshProfile = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await clientApiFetchWithAuth<UserProfile>("/api/profile/get")
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh profile")
    } finally {
      setLoading(false)
    }
  }, [clientApiFetchWithAuth])

  // On mount, check if we need to fetch profile data
  useEffect(() => {
    if (!loginData && !hasAttemptedFetch) {
      fetchProfile()
    } else if (loginData) {
      setLoading(false)
    }
  }, [loginData, hasAttemptedFetch, fetchProfile])

  return (
    <UserContext.Provider
      value={{
        loginData,
        profile,
        loading,
        error,
        setLoginData,
        setProfile,
        fetchProfile,
        refreshProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}