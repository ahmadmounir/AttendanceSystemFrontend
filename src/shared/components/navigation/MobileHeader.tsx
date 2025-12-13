import { LucidePanelLeft } from "lucide-react"
import { useLocation } from "react-router-dom"
import { getPageNameFromLinksInfo } from "@/shared/utils";

// Define interface for window.engageUI
interface EngageUI {
  toggleSettingsSidebar?: () => void;
}

// Extend Window interface
declare global {
  interface Window {
    engageUI?: EngageUI;
  }
}

import { UserDropdown, Button, Avatar, AvatarFallback } from "@/shared/components/ui"
import { cn } from "@/shared/utils/cn"
import { useProfile } from "@/shared/stores/profileStore"
import type { Profile } from "@/shared/types/api"
import getInitials from "@/shared/utils/getInitials";

// Get user data from profile
function getUserData(profileData: Profile | null) {
  if (profileData) {
    return {
      name: `${profileData.firstName} ${profileData.lastName}`,
      email: profileData.email,
      avatar: "",
      username: profileData.email,
      role: profileData.role,
      tenantName: profileData.tenantName
    }
  }
  
  return {
    name: "John Doe",
    email: "john.doe@plutosoft.com",
    avatar: "",
    username: "john.doe",
    role: "Admin",
    tenantName: "Plutosoft"
  }
}

export function MobileHeader() {
  const profile = useProfile()
  const user = getUserData(profile)
  const location = useLocation()
  const isSettingsPage = location.pathname.startsWith('/settings')

  const handleToggleSettingsSidebar = () => {
    if (window.engageUI?.toggleSettingsSidebar) {
      window.engageUI.toggleSettingsSidebar();
    }
  }
  
  // Get the current page title from the last path segment
  const getPageTitle = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) {
      return 'Home';
    }
    
    // Check if this is a settings page with section/page structure
    if (pathSegments[0] === 'settings' && pathSegments.length === 3) {
      const section = pathSegments[1];
      const page = pathSegments[2];
      
      // Try to get page name translation key from linksInfo configuration
      const pageNameKey = getPageNameFromLinksInfo(section, page);
      if (pageNameKey) {
        return pageNameKey;
      }
    }
    
    // Check if this is a two-level route (e.g., /contacts/:contactId)
    if (pathSegments.length === 2) {
      const section = pathSegments[0];
      const page = pathSegments[1];
      
      // Try to get page name translation key from linksInfo configuration
      const pageNameKey = getPageNameFromLinksInfo(section, page);
      if (pageNameKey) {
        return pageNameKey;
      }
    }
    
    // Check if this is a single-level route (e.g., /contacts)
    if (pathSegments.length === 1) {
      const section = pathSegments[0];
      
      // Try to get page name translation key from linksInfo configuration
      const pageNameKey = getPageNameFromLinksInfo(section);
      if (pageNameKey) {
        return pageNameKey;
      }
    }
    
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // If translation exists, use it; otherwise format the segment
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  };
  
  const pageTitle = getPageTitle();

  return (
    <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 md:hidden">
      {/* Settings Page Toggle Button */}
      {isSettingsPage && (
        <Button 
          onClick={handleToggleSettingsSidebar}
          variant="ghost"
          size="icon"
          className={cn("shrink-0 -ms-1 size-7 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4")}
        >
          <LucidePanelLeft />
          <span className="sr-only">toggleSettingsSidebar</span>
        </Button>
      )}
      
      {/* Separator after toggle button */}
      {isSettingsPage && (
        <div className="bg-border shrink-0 w-px h-4 me-2"></div>
      )}

      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="flex-1">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5  break-words sm:gap-2.5">
          <li className="inline-flex items-center gap-1.5">
            <span role="link" aria-disabled="true" aria-current="page" className="text-foreground font-normal">
              {pageTitle}
            </span>
          </li>
        </ol>
      </nav>

      {/* Profile Dropdown */}
      <UserDropdown align="end">
        <Avatar className="h-9 w-9 cursor-pointer flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground font-medium">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </UserDropdown>
    </header>
  )
}
