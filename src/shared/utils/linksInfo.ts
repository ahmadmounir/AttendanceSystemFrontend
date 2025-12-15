import { 
  Home,  
  User, 
  Users,
  ClipboardList,
  Clock,
  CalendarDays,
  Briefcase,
  Building2
} from "lucide-react";

// Portal navigation items (Admin only)
export const portalNavigationItems = [
  {
    name: "Dashboard",
    href: "/portal/dashboard",
    icon: Home,
    exact: true,
    requiresAdmin: true,
  },
  {
    name: "Departments",
    href: "/portal/departments",
    icon: Building2,
    exact: false,
    requiresAdmin: true,
  },
  {
    name: "Job Titles",
    href: "/portal/job-titles",
    icon: Briefcase,
    exact: false,
    requiresAdmin: true,
  },
  {
    name: "Employees",
    href: "/portal/employees",
    icon: Users,
    exact: false,
    requiresAdmin: true,
  },
  {
    name: "Attendance Log",
    href: "/portal/attendance-log",
    icon: ClipboardList,
    exact: false,
    requiresAdmin: true,
  },
  {
    name: "Leave Requests",
    href: "/portal/leave-requests",
    icon: CalendarDays,
    exact: false,
    requiresAdmin: true,
  },
  {
    name: "Overtime Requests",
    href: "/portal/overtime-requests",
    icon: Clock,
    exact: false,
    requiresAdmin: true,
  }
];

// Employee navigation items (Members)
export const employeeNavigationItems = [
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    exact: true,
    requiresAdmin: false,
  },
  {
    name: "Leave Requests",
    href: "/leave-requests",
    icon: CalendarDays,
    exact: false,
    requiresAdmin: false,
  },
  {
    name: "Overtime Requests",
    href: "/overtime-requests",
    icon: Clock,
    exact: false,
    requiresAdmin: false,
  }
];

// Combined sidebar navigation (will be filtered based on role)
export const sidebarNavigationItems = [
  ...portalNavigationItems,
  ...employeeNavigationItems,
];

// Remove old settings/contacts/apps configs as they're not needed in this system