"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  //SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { UserDropdown } from "@/components/user-dropdown"
import { useUserProfile } from "@/hooks/use-user-profile"
import {
  Building,
  Settings,
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Building,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { profile, loading, loginData } = useUserProfile()
  
  // Hide sidebar on auth routes
  const isAuthRoute = pathname?.startsWith("/auth")
  
  if (isAuthRoute) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="h-screen overflow-hidden">
      <SidebarProvider>
        <Sidebar variant="inset" className="h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Building className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {loginData?.tenantName || profile?.tenantName || "Default Workspace"}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        className="py-5 px-3" 
                        asChild 
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <UserDropdown profile={profile} loginData={loginData} loading={loading} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="h-[calc(100vh-20px)]">
          <Header />
            <div className="overflow-auto bg-background p-4 rounded-xl">
              {children}
            </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
