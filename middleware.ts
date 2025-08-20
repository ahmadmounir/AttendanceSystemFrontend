import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("access_token")?.value

  // Define valid routes in your application
  const validRoutes = [
    "/",
    "/dashboard",
    "/settings/*",
    "/auth/login",
    "/auth/signup", 
    "/auth/reset-password"
  ]

  // Check if the current path is a valid route or starts with a valid route pattern
  const isValidRoute = validRoutes.some(route => {
    if (route === pathname) return true
    if (pathname.startsWith(route + "/")) return true
    return false
  })

  // If it's not a valid route, let Next.js handle it (will show 404)
  if (!isValidRoute) {
    return NextResponse.next()
  }

  // Root redirect logic
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/dashboard" : "/auth/login", request.url)
    )
  }

  // Auth pages logic
  if (pathname.startsWith("/auth")) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Protected routes logic
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
}
