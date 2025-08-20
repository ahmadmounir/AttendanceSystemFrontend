import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

type LoginRequest = {
  username: string
  password: string
  tenantId?: string
}

type LoginResponse = {
  tenantId: string
  tenantName: string
  username: string
  email: string
  name: string
  role: string
  accessToken: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    // Call the external API
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.json().catch(() => ({ message: "Unknown error" }))
      return NextResponse.json(
        { error: errorText.message },
        { status: response.status }
      )
    }

    const data: LoginResponse = await response.json()

    // Create response
    const nextResponse = NextResponse.json(data)

    // Set httpOnly cookie with the access token
    const cookieStore = await cookies()
    cookieStore.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return nextResponse
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
