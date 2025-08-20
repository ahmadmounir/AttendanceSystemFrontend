import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("access_token")?.value

    console.log("Token from cookies:", token ? "Token found" : "No token found")

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Make request to the actual verify email begin endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL

    console.log("API URL:", apiUrl)

    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(`${apiUrl}/profile/verify-email/begin`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Response:", response)

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: errorText || "Failed to send verification email" },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verify email begin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
