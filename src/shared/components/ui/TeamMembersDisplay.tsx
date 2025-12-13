import React from "react";
import {
  Avatar,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui";
import { User } from "lucide-react";
import type { TeamMember } from "@/shared/types/api";

interface TeamMembersDisplayProps {
  members: TeamMember[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  showNameOnly?: boolean;
}

export const TeamMembersDisplay = React.memo(function TeamMembersDisplay({ 
  members, 
  maxDisplay = 5,
  size = "md",
  showNameOnly = false
}: TeamMembersDisplayProps) {
  
  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  const getMemberDisplayName = (member: TeamMember) => {
    const fullName = `${member.firstName} ${member.lastName}`.trim();
    return fullName || member.email;
  };

  const getAvatarSize = () => {
    switch (size) {
      case "sm": return "h-6 w-6";
      case "lg": return "h-10 w-10";
      default: return "h-8 w-8";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm": return "h-3 w-3";
      case "lg": return "h-5 w-5";
      default: return "h-4 w-4";
    }
  };

  if (members.length === 0) {
    return (
      <div className=" text-muted-foreground">
        No members
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-3">
        {displayMembers.map((member, index) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <Avatar className={`${getAvatarSize()} flex items-center justify-center bg-blue-100 border-2 border-background relative z-${100 + index}`}>
                <User className={`${getIconSize()} text-blue-800`} />
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <div className="">
                <div className="font-medium">{getMemberDisplayName(member)}</div>
                {!showNameOnly && (
                  <div className="text-muted-foreground">{member.email}</div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className={`${getAvatarSize()} flex items-center justify-center bg-muted border-2 border-background`}>
                <span className="text-xs font-medium">+{remainingCount}</span>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <div className="">
                {remainingCount} more {remainingCount === 1 ? 'member' : 'members'}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
});