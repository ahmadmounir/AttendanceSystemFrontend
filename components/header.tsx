"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Header() {
  const pathname = usePathname()

  // Parse pathname to build breadcrumb structure
  const pathSegments = pathname.split('/').filter(Boolean)
  
  const buildBreadcrumbs = () => {
    const breadcrumbs = []

    // Always start with Home
    breadcrumbs.push({
      label: "Home",
      href: "/",
      isLink: true
    })

    // Build breadcrumbs from path segments
    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      // Capitalize and format segment names
      let label = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      // Handle special cases
      if (segment === "memberships") {
        label = "Memberships"
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isLink: !isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = buildBreadcrumbs()

  return (
    <header className="sticky rounded-b-none border-b top-0 z-40 flex h-16 shrink-0 items-center gap-2 bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 rounded-xl">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className="hidden md:block">
                  {crumb.isLink ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
