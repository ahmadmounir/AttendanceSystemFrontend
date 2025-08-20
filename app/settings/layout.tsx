"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Settings, Shield, User, Users} from "lucide-react"

const settingsNavigation = [
    {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Memberships", 
    href: "/settings/memberships",
    icon: Users,
  },
  {
    name: "Profile",
    href: "/settings/profile",
    icon: User,
  },
  {
    name: "Security", 
    href: "/settings/security",
    icon: Shield,
  }
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

// Settings Navigation Component
function SettingsNav({ className }: { className?: string }) {
  const pathname = usePathname()

  const settingsNavigationWithDesc = settingsNavigation

  return (
    <div className={cn("flex flex-col h-full sticky top-0 bg-card rounded-2xl border", className)}>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {settingsNavigationWithDesc.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                isActive ? "text-accent-foreground" : "text-muted-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium",
                  isActive ? "text-accent-foreground" : "text-foreground"
                )}>
                  {item.name}
                </div>
                <div className={cn(
                  "text-xs leading-tight mt-0.5",
                  isActive ? "text-accent-foreground/80" : "text-muted-foreground"
                )}>
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

    </div>
  )
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        {/* Mobile Horizontal Tabs - Sticky */}
        <div className="sticky top-0 bg-transparent pb-3 z-10">
          <div className="flex overflow-x-auto justify-center scrollbar-hide px-2 border rounded-2xl">
            {settingsNavigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 whitespace-nowrap px-3 py-4 text-xs font-medium transition-colors border-b-2 min-w-fit",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar - Sticky */}
      <div className="w-64">
        <div className="h-full me-6">
          <SettingsNav />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
