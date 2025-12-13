import { Bell, Building, Building2, Contact, Home, LayoutGrid, Lock, Settings, User, Users } from "lucide-react";

export const sidebarNavigationItems = [
  {
    name: "Dashboard",
    nameKey: "common:dashboard",
    href: "/",
    icon: Home,
    exact: true,
  },
  {
    name: "Contacts",
    nameKey: "common:contacts",
    href: "/contacts",
    icon: Contact,
    exact: false,
  },
  {
    name: "Applications",
    nameKey: "common:applications",
    href: "/apps",
    icon: LayoutGrid,
    exact: false,
  },
  {
    name: "Settings",
    nameKey: "common:settings",
    href: "/settings", 
    icon: Settings,
    exact: false,
  },
]

// Structure for settings navigation
export const settingsConfig = {
  title: 'Settings',
  sections: [
    {
      title: 'My Account',
      items: [
        {
          name: 'Profile',
          nameKey: 'common:profile',
          href: '/settings',
          icon: User,
          exact: true,
        },
        {
          name: 'Workspaces',
          nameKey: 'common:workspaces',
          href: '/settings/workspaces',
          icon: Building2,
          exact: false,
        },
        {
          name: 'Security',
          nameKey: 'common:security',
          href: '/settings/security',
          icon: Lock,
          exact: false,
        },
        {
          name: 'Notifications',
          nameKey: 'common:notifications',
          href: '/settings/notifications',
          icon: Bell,
          exact: false,
        },
      ]
    },
    {
      title: 'Workspace',
      items: [
        {
          name: 'General',
          nameKey: 'common:general',
          href: '/settings/workspace',
          icon: Building,
          exact: false,
        },
        {
          name: 'Members',
          nameKey: 'common:members',
          href: '/settings/workspace/members',
          icon: Users,
          exact: false,
        },
        {
          name: 'Teams',
          nameKey: 'common:teams',
          href: '/settings/workspace/teams',
          icon: Users,
          exact: false,
        },
        {
          name: 'Integrations',
          nameKey: 'common:integrations',
          href: '/settings/workspace/integrations',
          icon: LayoutGrid,
          exact: false,
        },
      ]
    },
    {
      title: 'Contacts',
      items: [
        {
          name: 'Groups',
          nameKey: 'common:groups',
          href: '/settings/contacts/groups',
          icon: Users,
          exact: false,
        },
      ]
    }
  ]
};

// Contacts navigation configuration
export const contactsConfig = {
  title: 'Contacts',
  items: [
    {
      name: 'All Contacts',
      nameKey: 'contacts:pageTitle',
      href: '/contacts',
      icon: Contact,
      exact: true,
    },
    {
      name: 'Imports',
      nameKey: 'contacts:imports',
      href: '/contacts/imports',
      icon: Contact,
    },
    {
      name: 'Upload',
      nameKey: 'import',
      href: '/contacts/import',
      icon: Contact,
    },
  ]
};

// Apps navigation configuration
export const appsConfig = {
  title: 'Applications',
  items: [
    {
      name: 'Chat Widgets',
      nameKey: 'apps:chatWidgets.title',
      href: '/apps/chat_widgets',
      exact: false,
    },
    {
      name: 'WhatsApp Web',
      nameKey: 'apps:whatsappWeb.title',
      href: '/apps/whatsapp_web',
      exact: false,
    },
  ]
};