import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const token = request.headers.get("authorization")?.replace("Bearer ", "") || 
                  request.cookies.get("access_token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Make request to the actual profile endpoint
    const profileUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL

    console.log("Fetching profile from:", profileUrl)
    if (!profileUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(`${profileUrl}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
