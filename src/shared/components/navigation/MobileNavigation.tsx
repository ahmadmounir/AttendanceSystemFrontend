import { Link, useLocation } from "react-router-dom"
import { cn, isPathActive } from "@/shared/utils/cn"
import { sidebarNavigationItems } from "@/shared/utils/linksInfo";

// Inline navigation data
const navigationItems = sidebarNavigationItems;

export function MobileNavigation() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <nav className="flex items-center justify-around px-2 py-1">
        {navigationItems.map((item) => {
          // Get all paths for conflict detection
          const allPaths = navigationItems.map(navItem => navItem.href);
          
          const isActive = isPathActive(
            location.pathname, 
            item.href, 
            item.exact || false,
            allPaths
          );
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
            </Link>
          )
        })}
      </nav>
    </div>
  )
}