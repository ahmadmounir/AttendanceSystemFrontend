import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Remove the access token cookie
    const cookieStore = await cookies()
    cookieStore.delete("access_token")

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
