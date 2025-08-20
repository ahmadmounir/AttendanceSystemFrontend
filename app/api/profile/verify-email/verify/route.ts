import { NextRequest, NextResponse } from "next/server"

type VerifyEmailRequest = {
  code: string
}

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("access_token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body: VerifyEmailRequest = await request.json()

    // Make request to the actual verify email verify endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL

    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(`${apiUrl}/profile/verify-email/verify`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to verify code" }))
      return NextResponse.json(
        { error: errorData.error || "Failed to verify code" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Verify email verify error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
