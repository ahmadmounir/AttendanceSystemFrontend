import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy } from "react";
import { ThemeProvider } from "@/shared/components/theme";
import {
  ProtectedRoute,
  AuthProtectedRoute,
  AdminProtectedRoute,
} from "@/shared/components/guards";
import Login from "@/features/auth/components/Login";
import { Toaster } from "@/shared/components/ui";
import {
  StaticSidebar,
  MobileHeader,
  MobileNavigation,
  DesktopHeader,
} from "@/shared/components/navigation";
import { useProfileHydration } from "@/shared/hooks";

// Lazy load portal pages
const PortalDashboard = lazy(() => import("@/features/portal/pages/Dashboard"));
const PortalDepartments = lazy(
  () => import("@/features/portal/pages/Departments")
);
const PortalJobTitles = lazy(() => import("@/features/portal/pages/JobTitles"));
const PortalEmployees = lazy(() => import("@/features/portal/pages/Employees"));
const PortalAttendanceLog = lazy(
  () => import("@/features/portal/pages/AttendanceLog")
);
const PortalLeaveRequests = lazy(
  () => import("@/features/portal/pages/LeaveRequests")
);
const PortalOvertimeRequests = lazy(
  () => import("@/features/portal/pages/OvertimeRequests")
);

// Lazy load employee pages
const EmployeeProfile = lazy(() => import("@/features/employee/pages/Profile"));
const EmployeeLeaveRequests = lazy(
  () => import("@/features/employee/pages/LeaveRequests")
);
const EmployeeOvertimeRequests = lazy(
  () => import("@/features/employee/pages/OvertimeRequests")
);

// Add this script to set theme on initial page load
const setInitialTheme = () => {
  const theme = localStorage.getItem("attendance-systemtheme") || "system";
  const root = window.document.documentElement;

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
    document.body.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
    document.body.classList.add(theme);
  }
};

// Execute it immediately
setInitialTheme();

// Layout component to handle sidebar
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isLoginRoute = location.pathname === "/login";
  const isOnboardingRoute = pathSegments[0] === "onboarding";
  const isEmailRoute = pathSegments[0] === "email";
  const isChangeEmailRoute = pathSegments[0] === "change-email";
  const isPasswordRoute = pathSegments[0] === "password";
  const isInvitationRoute = pathSegments[0] === "invitation";

  // Don't show navigation for auth, onboarding, email, change-email, password, and invitation routes
  if (
    isLoginRoute ||
    isOnboardingRoute ||
    isEmailRoute ||
    isChangeEmailRoute ||
    isPasswordRoute ||
    isInvitationRoute
  ) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Static Sidebar for Desktop */}
      <StaticSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Desktop Header with Breadcrumbs */}
        <DesktopHeader />

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-12 md:pb-0">{children}</main>
      </div>
    </div>
  );
}

// Inner component to handle profile hydration (needs Router context)
function AppContent() {
  // Hydrate profile on app mount (handles page refresh)
  useProfileHydration();

  return (
    <AppLayout>
      <Routes>
        {/* Auth routes - protected from authenticated users */}
        <Route element={<AuthProtectedRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Portal routes - admin only */}
        <Route element={<AdminProtectedRoute />}>
          <Route
            path="/portal"
            element={<Navigate to="/portal/dashboard" replace />}
          />
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
          <Route path="/portal/departments" element={<PortalDepartments />} />
          <Route path="/portal/job-titles" element={<PortalJobTitles />} />
          <Route path="/portal/employees" element={<PortalEmployees />} />
          <Route
            path="/portal/attendance-log"
            element={<PortalAttendanceLog />}
          />
          <Route
            path="/portal/leave-requests"
            element={<PortalLeaveRequests />}
          />
          <Route
            path="/portal/overtime-requests"
            element={<PortalOvertimeRequests />}
          />
        </Route>

        {/* Employee routes - protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<EmployeeProfile />} />
          <Route path="/leave-requests" element={<EmployeeLeaveRequests />} />
          <Route
            path="/overtime-requests"
            element={<EmployeeOvertimeRequests />}
          />
        </Route>

        {/* Redirect root to profile */}
        <Route path="/" element={<Navigate to="/profile" replace />} />

        {/* Redirect all other routes to profile */}
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="attendance-system-theme">
      <Router>
        <AppContent />
      </Router>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;
