import { portalNavigationItems, employeeNavigationItems } from './linksInfo';

/**
 * Find page name from linksInfo configuration
 * @param section - The section (e.g., 'portal', 'profile')
 * @param page - The page identifier
 * @returns The page name from configuration or null if not found
 */
export function getPageNameFromLinksInfo(section: string, page?: string): string | null {
  // Combine all navigation items
  const allItems = [...portalNavigationItems, ...employeeNavigationItems];

  // If no page specified, find section root
  if (!page) {
    const item = allItems.find(item => item.href === `/${section}`);
    return item?.name || null;
  }

  // Find specific page
  const item = allItems.find(item => 
    item.href === `/${section}/${page}` || item.href === `/${page}`
  );
  
  return item?.name || null;
}
