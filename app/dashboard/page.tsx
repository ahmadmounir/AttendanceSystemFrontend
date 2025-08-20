"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Users,
  Building,
  Calendar,
  ArrowRight,
} from "lucide-react"

// Mock data for user's workspaces
// const workspaces = [
//   {
//     id: 1,
//     name: "Acme Corporation",
//     description: "Main company workspace for project management and collaboration",
//     role: "Admin",
//     members: 24,
//     lastActivity: "2024-08-10",
//     status: "active",
//     color: "bg-blue-500",
//   },
//   {
//     id: 2,
//     name: "TechStart Project",
//     description: "Startup project workspace for product development",
//     role: "Member",
//     members: 8,
//     lastActivity: "2024-08-09",
//     status: "active",
//     color: "bg-green-500",
//   },
//   {
//     id: 3,
//     name: "Design Team",
//     description: "Creative workspace for design and branding projects",
//     role: "Member",
//     members: 12,
//     lastActivity: "2024-08-05",
//     status: "active",
//     color: "bg-purple-500",
//   },
// ]

export default function WorkspacesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight">My Workspaces</h1>
        <p className="text-muted-foreground">
          Access and manage your workspaces and collaborate with your teams.
        </p>
      </div> */}

      {/* Search */}
      {/* {workspaces.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search workspaces..." className="pl-10" />
        </div>
      )} */}

      {/* Workspaces Grid */}
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg ${workspace.color} flex items-center justify-center text-white font-semibold text-lg`}>
                    {workspace.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {workspace.name}
                    </CardTitle>
                    <Badge variant={workspace.role === "Admin" ? "default" : "secondary"} className="mt-1">
                      {workspace.role}
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {workspace.description}
              </CardDescription>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {workspace.members} members
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {workspace.status}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last activity: {new Date(workspace.lastActivity).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* Empty State or Join Workspace */}
      {/* <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Need access to another workspace?
          </CardTitle>
          <CardDescription>
            If you have an invitation code or workspace link, you can join additional workspaces here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            Join Workspace
          </Button>
        </CardContent>
      </Card> */}
    </div>
  )
}
