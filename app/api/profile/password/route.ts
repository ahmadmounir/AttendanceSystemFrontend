import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    // Get the authorization token from headers
    const token = request.headers.get("authorization")?.replace("Bearer ", "") || 
                  request.cookies.get("access_token")?.value
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Make request to your backend API
    const response = await fetch(`${BASE_URL}/profile/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to change password" },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
