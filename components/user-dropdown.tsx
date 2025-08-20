"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { UserProfile } from "@/hooks/use-user-profile"
import { LoginUserData, useUser } from "@/contexts/user-provider"
import { LogOut, Moon, Sun, Monitor } from "lucide-react"

interface UserDropdownProps {
  profile: UserProfile | null
  loginData: LoginUserData | null
  loading: boolean
}

export function UserDropdown({ profile, loginData, loading }: UserDropdownProps) {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { setLoginData, setProfile } = useUser()
  
  // Use login data for display name if available, otherwise use profile
  const displayName = loginData 
    ? loginData.name
    : profile 
    ? `${profile.firstName} ${profile.lastName}`.trim() 
    : "Loading..."
  
  const email = loginData?.email || profile?.email || ""
  
  const initials = displayName && displayName !== "Loading..."
    ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "..."

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setOpen(false) // Close dropdown after theme change
  }

  const handleLogout = async () => {
    setOpen(false) // Close dropdown first
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        // Clear user context
        setLoginData(null)
        setProfile(null)
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start h-auto p-2 hover:bg-sidebar-accent">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/user.png" alt="User" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {loading ? "" : displayName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {loading ? "" : email}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end" forceMount>
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light Theme
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark Theme
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System Theme
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
