import { settingsConfig, contactsConfig, sidebarNavigationItems, appsConfig } from './linksInfo';

/**
 * Find page name translation key from linksInfo configuration
 * @param section - The section (e.g., 'contacts', 'workspace', 'settings')
 * @param page - The page identifier (could be a slug or UUID)
 * @param subPage - Optional sub-page identifier for nested routes
 * @returns The page name translation key from configuration or null if not found
 */
export function getPageNameFromLinksInfo(section: string, page?: string, subPage?: string): string | null {
  // Check if page is a UUID pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = page ? uuidPattern.test(page) : false;

  // Special handling for contact details (UUID in contacts section)
  if (section === 'contacts' && page && isUuid) {
    return 'contacts:contactDetails';
  }

  // Check if it's a main sidebar item (like /contacts)
  if (!page || page === section) {
    const mainItem = sidebarNavigationItems.find(item => 
      item.href === `/${section}` || item.href === `/settings/${section}`
    );
    if (mainItem && 'nameKey' in mainItem) {
      return mainItem.nameKey;
    }

    // Check contacts config
    if (section === 'contacts') {
      const contactItem = contactsConfig.items.find(item => item.href === '/contacts');
      return contactItem?.nameKey || null;
    }
  }

  // Check contacts sub-pages (like /contacts/imports)
  if (section === 'contacts' && page && !isUuid) {
    // Check for nested routes (like /contacts/import)
    if (subPage) {
      const nestedPage = contactsConfig.items.find(item => 
        item.href === `/contacts/${page}/${subPage}`
      );
      if (nestedPage?.nameKey) {
        return nestedPage.nameKey;
      }
    }
    
    // Check for direct sub-pages
    const contactPage = contactsConfig.items.find(item => 
      item.href === `/contacts/${page}`
    );
    if (contactPage?.nameKey) {
      return contactPage.nameKey;
    }
  }

  // Check apps sub-pages (like /apps/chat_widgets)
  if (section === 'apps' && page) {
    const appPage = appsConfig.items.find(item => 
      item.href === `/apps/${page}`
    );
    if (appPage?.nameKey) {
      return appPage.nameKey;
    }
  }

  // Find the section in settingsConfig
  const sectionConfig = settingsConfig.sections.find(s => 
    s.items.some(item => {
      const itemPath = item.href.split('/').filter(Boolean);
      return itemPath.includes(section);
    })
  );

  if (!sectionConfig) return null;

  // If no specific page, return the section root
  if (!page) {
    const rootItem = sectionConfig.items.find(item => 
      item.href === `/settings/${section}` || item.exact
    );
    return rootItem?.nameKey || null;
  }

  // Look for exact match with page
  const item = sectionConfig.items.find(item => 
    item.href === `/settings/${section}/${page}` || 
    item.href === `/${section}/${page}`
  );
  
  return item?.nameKey || null;
}
