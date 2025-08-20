import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppLayout } from "@/components/app-layout"
import { Toaster } from "@/components/toaster"
import { UserProvider } from "@/contexts/user-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CRM Platform",
  description:
    "A powerful CRM platform that helps you organize, monitor, and scale your customer operations efficiently.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full overflow-hidden`}>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
