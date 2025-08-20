import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

type ResetPasswordVerifyRequest = {
  address: string
  code: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordVerifyRequest = await request.json()

    // Validate required fields
    if (!body.address || !body.code) {
      return NextResponse.json(
        { error: "Email address and verification code are required" },
        { status: 400 }
      )
    }

    // Call the external API
    const response = await fetch(`${BASE_URL}/auth/reset-password/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.json().catch(() => ({ message: "Unknown error" }))
      return NextResponse.json(
        { error: `Code verification failed: ${errorText.message}` },
        { status: response.status }
      )
    }

    // Return success response
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Reset password verify API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
