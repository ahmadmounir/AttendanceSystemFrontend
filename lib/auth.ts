import { cookies } from "next/headers"

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get("access_token")?.value || null
  } catch {
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken()
  return !!token
}
