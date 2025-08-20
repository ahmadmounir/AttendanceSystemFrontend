"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/contexts/user-provider"
import { Building, Crown, User as UserIcon, MoreVertical, LogOut, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Tenant {
  id: string
  name: string
  role: string
  isActive?: boolean
}

interface MembershipsTabProps {
  profile: UserProfile
}

export function MembershipsTab({ profile }: MembershipsTabProps) {
  // Mock data for now - in real app this would come from API
  const [tenants] = useState<Tenant[]>([
    {
      id: "1",
      name: profile.tenantName || "Default Tenant",
      role: "User", // This would come from API in real app
      isActive: true
    },
    {
      id: "2", 
      name: "Secondary Organization",
      role: "Admin",
      isActive: false
    },
    {
      id: "3",
      name: "Project Team Alpha",
      role: "Member", 
      isActive: false
    }
  ])

  const handleSwitchTenant = (tenantId: string) => {
    // TODO: Implement tenant switching
    console.log("Switching to tenant:", tenantId)
  }

  const handleLeaveTenant = (tenantId: string) => {
    // TODO: Implement leave tenant
    console.log("Leaving tenant:", tenantId)
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return <Crown className="h-4 w-4" />
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />
      default:
        return <UserIcon className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return "default" as const
      case 'owner':
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Memberships
          </CardTitle>
          <CardDescription>
            Manage your memberships across different organizations and teams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  tenant.isActive ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tenant.name}</p>
                      {tenant.isActive && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleIcon(tenant.role)}
                      <Badge variant={getRoleBadgeVariant(tenant.role)} className="text-xs">
                        {tenant.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!tenant.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwitchTenant(tenant.id)}
                    >
                      Switch
                    </Button>
                  )}
                  
                  {/* Only show menu for non-active tenants or if user can leave */}
                  {(!tenant.isActive || tenant.role.toLowerCase() !== 'owner') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!tenant.isActive && (
                          <DropdownMenuItem onClick={() => handleSwitchTenant(tenant.id)}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Switch to this organization
                          </DropdownMenuItem>
                        )}
                        {tenant.role.toLowerCase() !== 'owner' && (
                          <DropdownMenuItem 
                            onClick={() => handleLeaveTenant(tenant.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Leave organization
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Join Organization Section */}
      <Card>
        <CardHeader>
          <CardTitle>Join New Organization</CardTitle>
          <CardDescription>
            Have an invitation code? Join a new organization or team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Join Organization
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
