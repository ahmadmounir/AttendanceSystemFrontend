import { GalleryVerticalEnd } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn, isPathActive } from "@/shared/utils/cn";
import {
  UserDropdown,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Avatar,
  AvatarFallback,
} from "@/shared/components/ui";
import { useProfile } from "@/shared/stores/profileStore";
import {
  portalNavigationItems,
  employeeNavigationItems,
} from "@/shared/utils/linksInfo";
import { isAdminRole } from "@/shared/utils/roles";
import type { Profile } from "@/shared/types/api";
import getInitials from "@/shared/utils/getInitials";

// Get user data from profile
function getUserData(profileData: Profile | null) {
  return {
    name: profileData?.name || "User",
    email: profileData?.username || "user@example.com",
    avatar: "",
    username: profileData?.username || "user",
    role: profileData?.role || "member",
  };
}

export function StaticSidebar() {
  const location = useLocation();
  const profile = useProfile();
  const user = getUserData(profile);

  // Filter navigation items based on user role
  const navigationItems = isAdminRole(profile?.role)
    ? portalNavigationItems
    : employeeNavigationItems;

  return (
    <div className="hidden md:flex flex-col w-15 bg-background rtl:border-l ltr:border-r h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16">
        <Link
          to="/"
          className="bg-primary text-primary-foreground flex w-8 h-8 items-center justify-center rounded-md hover:bg-primary/90 transition-colors"
        >
          <GalleryVerticalEnd className="size-5" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-2 px-2">
            {navigationItems.map((item) => {
              // Get all paths for conflict detection
              const allPaths = navigationItems.map((navItem) => navItem.href);

              const isActive = isPathActive(
                location.pathname,
                item.href,
                item.exact || false,
                allPaths
              );
              const Icon = item.icon;

              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </nav>

      {/* User Menu */}
      <div className="p-2 flex items-center justify-center">
        <UserDropdown className="mb-5" align="start" side="right">
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground  font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </UserDropdown>
      </div>
    </div>
  );
}
