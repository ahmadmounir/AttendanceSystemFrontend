import { useNavigate } from "react-router-dom";
import React from "react";
import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { Avatar, AvatarFallback } from "@/shared/components/ui/Avatar";
import { logout } from "@/features/auth/api/authApi";
import { useProfile } from "@/shared/stores/profileStore";
import type { Profile } from "@/shared/types/api";
import getInitials from "@/shared/utils/getInitials";
import { ThemeSwitcher } from "../theme";

// Get user data from profile
function getUserData(profileData: Profile | null) {
  try {
    if (profileData) {
      return {
        name: profileData.name,
        email: profileData.username,
        avatar: "",
        username: profileData.username,
        role: profileData.role,
      };
    }
  } catch (error) {
    console.error("Error parsing profile data:", error);
  }

  return {
    name: "User",
    email: "user@example.com",
    avatar: "",
    username: "user",
    role: "member",
  };
}

interface UserDropdownProps {
  children: React.ReactNode;
  align?: "start" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
}

export function UserDropdown({
  children,
  align = "start",
  side = "bottom",
  sideOffset = 10,
  className,
}: UserDropdownProps) {
  const navigate = useNavigate();
  const currentUser = useProfile();
  const user = getUserData(currentUser);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    handleNavigation("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-68 ${className}`}
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-base">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate">{user.name}</p>
              <p className=" text-muted-foreground truncate font-normal">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <ThemeSwitcher size="sm" />
        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className={`h-4 w-4 me-2`} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
