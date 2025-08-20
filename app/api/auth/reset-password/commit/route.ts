import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

type ResetPasswordCommitRequest = {
  token: string
  newPassword: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordCommitRequest = await request.json()

    // Validate required fields
    if (!body.token || !body.newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      )
    }

    // Call the external API
    const response = await fetch(`${BASE_URL}/auth/reset-password/commit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.json().catch(() => ({ message: "Unknown error" }))
      return NextResponse.json(
        { error: `Password reset failed: ${errorText.message}` },
        { status: response.status }
      )
    }

    // Return success response
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Reset password commit API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
