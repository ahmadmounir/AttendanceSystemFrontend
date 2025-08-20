import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

type SignupRequest = {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  timezoneId: string
  phone?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json()

    // Validate required fields
    if (!body.username || !body.password || !body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: "Username, password, first name, last name, and email are required" },
        { status: 400 }
      )
    }

    // Call the external API
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.json().catch(() => ({ message: "Unknown error" }))
      return NextResponse.json(
        { error: `Signup failed: ${errorText.message}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Signup API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
