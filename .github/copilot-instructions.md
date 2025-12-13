# Attendance and Leave System Tracking - Developer Guide

## Project Overview
AttendanceSystemFrontend is a React 19 + TypeScript 5.6 + Vite 7 frontend for an Attendance and Leave System Tracking platform. Built with shadcn/ui components, Radix UI primitives, TailwindCSS v4, Zustand state management.

**System Type**: Dual-role application (Admin Portal + Employee Portal) in one unified system
**Language**: English only (no internationalization)
**Multi-tenancy**: Not supported
**Authentication**: Login only (no registration, password reset, or email verification)

## Architecture Principles

### Feature-Based Structure
Organize by feature domain, not by technical layer:
```
src/features/{feature}/
  ├── components/     # Feature UI components
  ├── api/           # Feature API calls
  ├── hooks/         # Feature-specific hooks (if needed)
  └── index.ts       # Public exports only
```

### Critical Path: Authentication Flow
1. User logs in via `/login` → `login()` API call returns token + profile
2. Token stored in `localStorage['attendance-system-token']`
3. Profile stored in **Zustand memory store** via `setProfile()` (never localStorage)
4. On app mount, `useProfileHydration()` auto-fetches profile if token exists but profile missing
5. All API calls via `fetcher()` auto-attach `Authorization: Bearer {token}` header
6. 401 responses auto-clear both token AND profile, redirect to `/login`
7. **Role-based Routing**:
   - If `profile.role === 'admin'` → redirect to `/portal/dashboard`
   - Otherwise → redirect to `/profile`

## Application Structure

### Portal Pages (Admin Only - `/portal/*`)
- **Dashboard** (`/portal/dashboard`) - Overview of system metrics
- **Departments** (`/portal/departments`) - Manage company departments
- **Job Titles** (`/portal/job-titles`) - Manage employee job titles
- **Employees** (`/portal/employees`) - Manage employee records
- **Attendance Log** (`/portal/attendance-log`) - View all attendance records
- **Leave Requests** (`/portal/leave-requests`) - Manage all leave requests
- **Overtime Requests** (`/portal/overtime-requests`) - Manage all overtime requests
- **Violations** (`/portal/violations`) - View and manage all violations
- **Settings** (`/portal/settings`) - System settings

### Member Pages (Employees - `/`)
- **Profile** (`/profile`) - User profile and personal information
- **Settings** (`/settings`) - Personal settings
- **Notifications** (`/notifications`) - Alerts from admin (can mark as read)
- **Leave Requests** (`/leave-requests`) - User's own leave requests (can add new)
- **Overtime Requests** (`/overtime-requests`) - User's own overtime requests (can add new)
- **Violations** (`/violations`) - Read-only view of user's violations

### State Management Rules
- **Profile Data**: ONLY in Zustand (`src/shared/stores/profileStore.ts`)
  - Access via `useProfile()` hook for reactive updates
  - Never use `localStorage.getItem('profile')` pattern
  - Security: Profile in memory only, cleared on logout/401
- **Auth Token**: `localStorage['attendance-system-token']` (transmitted, not rendered)
- **Theme**: `localStorage['attendance-system-theme']` via `ThemeProvider`

## API Integration Pattern

### Standard API Call Flow
```typescript
// 1. Define types in src/shared/types/api.ts
interface LoginResponse { token: string; profile: Profile; }

// 2. Create API function in feature/api/*.ts
export const login = async (email: string, password: string) => {
  const response = await fetcher<LoginResponse>('/auth/login', 'POST', { email, password });
  if (response.success) {
    localStorage.setItem('attendance-system-token', response.data.token);
    useProfileStore.getState().setProfile(response.data.profile);
  }
  return response;
};

// 3. Handle in component
const response = await login(email, password);
if (response.success) {
  navigate('/');
} else {
  showToast.error(response.message);
}
```

### Server Response Contract
```typescript
// ALL API responses follow this structure:
{
  success: boolean,        // Always present
  statusCode: number,      // Always present
  message: string | null,  // Present on error
  data: T,                 // Present on success
  paging?: { ... }        // Present if paginated
}
```

### Auto-Headers in fetcher()
- `Authorization: Bearer {token}` (if token exists)
- `Content-Type: application/json` (always)

## Route Protection

### Available Guards (src/shared/components/guards/)
```typescript
// Requires authentication
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<Home />} />
</Route>

// Blocks authenticated users (auth pages only)
<Route element={<AuthProtectedRoute />}>
  <Route path="/auth/login" element={<Login />} />
</Route>

// Requires admin/owner role
<Route element={<AdminProtectedRoute />}>
  <Route path="/settings/workspace" element={<WorkspaceSettings />} />
</Route>

// Guards invitation acceptance
<Route element={<InvitationProtectedRoute />}>
  <Route path="/invitation/accept" element={<InvitationAccept />} />
</Route>
```

### Admin Role Checking
```typescript
import { useIsAdmin } from '@/shared/hooks/useAdmin';

const { isAdmin, isLoading, profile } = useIsAdmin();
// isAdmin: null (loading) | true (admin/owner) | false (member)
// Checks profile.role for 'admin' or 'owner' (case-insensitive)
```

## Component Patterns

### CVA Variant System (shadcn/ui)
Split logic from styling for maintainability:
```typescript
// button-variants.ts - Pure styling variants
import { cva } from "class-variance-authority";
export const buttonVariants = cva(
  "base-classes-here",
  { variants: { ... }, defaultVariants: { ... } }
);

// Button.tsx - Logic + forwardRef
import { buttonVariants } from "./button-variants";
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
```

### Form Validation Pattern (Zod + React Hook Form)
```typescript
// 1. Define schema (infer types, no manual interfaces)
const formSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
type FormValues = z.infer<typeof formSchema>;

// 2. Setup form
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { email: '', password: '' }
});

// 3. Use Form components (NOT native inputs)
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField control={form.control} name="email" render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl><Input {...field} /></FormControl>
        <FormMessage /> {/* Auto-displays validation errors */}
      </FormItem>
    )} />
  </form>
</Form>
```
**See**: `src/features/auth/components/Login.tsx` for complete example

## Styling with TailwindCSS v4

### CSS Variable → Tailwind Bridge
```css
/* src/styles/index.css */
@theme inline {
  --color-primary: var(--primary);     /* Bridge CSS var to Tailwind */
  --color-background: var(--background);
  /* ... more mappings */
}

:root {
  --primary: oklch(0.205 0 0);         /* Light mode value */
}

.dark {
  --primary: oklch(0.922 0 0);         /* Dark mode value */
}
```

### Dark Mode Custom Variant
```css
@custom-variant dark (&:is(.dark *)); /* Enables dark: prefix */
```
Use `dark:bg-primary dark:text-foreground` in components.

### Theme Switching
Theme applied to `<html class="light|dark">` by ThemeProvider. Persisted in `localStorage['attendance-system-theme']`.

## Development Commands

```bash
npm run dev      # Vite dev server on http://localhost:3001 (configured in vite.config.ts)
npm run build    # tsc -b (type check) + vite build
npm run lint     # ESLint with react-hooks rules
npm run preview  # Preview production build locally
```

## Common Tasks

### Adding a New Feature
1. Create `src/features/{feature}/` directory
2. Add `components/`, `api/`, `hooks/` (if needed), `index.ts`
3. Define types in `src/shared/types/api.ts` (if shared across features)
4. Export public APIs through feature `index.ts`
5. Import from feature root: `@/features/my-feature`

### Adding a New API Endpoint
1. Add types to `src/shared/types/api.ts` (or feature-specific if isolated)
2. Create function in `features/{feature}/api/{feature}Api.ts`:
   ```typescript
   export const myApiCall = async (data: RequestType): Promise<ApiResponse<ResponseType>> => {
     return fetcher<ResponseType>('/endpoint', 'POST', data);
   };
   ```
3. Handle response in component (check `response.success`, show toast, etc.)

### Adding a Protected Route
```typescript
// In App.tsx or feature routing
<Route element={<ProtectedRoute />}>
  <Route path="/my-page" element={<MyPage />} />
</Route>

// For admin-only pages
<Route element={<AdminProtectedRoute />}>
  <Route path="/portal/settings" element={<PortalSettings />} />
</Route>
```

### Adding Navigation Item
Edit `src/shared/utils/linksInfo.ts`:
```typescript
// For main sidebar
export const sidebarNavigationItems = [
  { name: "Dashboard", href: "/", icon: Home, exact: true },
  // Add new item here
];

// For settings sidebar (filtered by admin status)
export const settingsConfig = { sections: [ ... ] };
```

## Critical Files Reference

| File | Purpose |
|------|---------|
| `src/shared/stores/profileStore.ts` | Zustand store for profile (setProfile, clearProfile, updateProfile) |
| `src/shared/services/apiClient.ts` | `fetcher()`, `handleResponse()`, 401 auto-logout logic |
| `src/shared/hooks/useProfileHydration.ts` | Auto-fetch profile on mount if token exists |
| `src/shared/hooks/useAdmin.ts` | `useIsAdmin()` hook for role checking |
| `src/shared/types/api.ts` | All TypeScript interfaces for API data |
| `src/shared/utils/linksInfo.ts` | Navigation config for sidebar/mobile |
| `src/shared/utils/cn.ts` | `cn()` utility for className merging (tailwind-merge + clsx) |
| `src/styles/index.css` | TailwindCSS v4 config, theme variables, dark mode |
| `src/App.tsx` | Root routes, lazy loading, ThemeProvider, Toaster |
| `vite.config.ts` | Vite config (port 3001, @/ alias, Tailwind plugin) |

## Environment Variables
```env
VITE_API_URL=https://api.engage-platform.com/v1  # API base URL (default if not set)
```

## Local Storage Keys
- `attendance-system-token`: JWT auth token (cleared on 401/logout)
- `attendance-system-theme`: Theme preference (`light|dark|system`)