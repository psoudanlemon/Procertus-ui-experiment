import type { IconSvgElement } from "@hugeicons/react";
import {
  AnalyticsUpIcon,
  Award01Icon,
  BookOpen01Icon,
  CubeIcon,
  FileEditIcon,
  HelpCircleIcon,
  HierarchySquare02Icon,
  Invoice01Icon,
  Setting06Icon,
  ShoppingBasket01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

export type PrototypeNavItem = {
  key: string;
  title: string;
  url: string;
  icon: IconSvgElement;
};

export type PrototypeNavGroup = {
  key: string;
  label: string;
  items: PrototypeNavItem[];
};

export const PROTOTYPE_PRIMARY_NAV: PrototypeNavItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: AnalyticsUpIcon as IconSvgElement,
  },
  {
    key: "user-management",
    title: "Gebruikersbeheer",
    url: "/user-management",
    icon: UserGroupIcon as IconSvgElement,
  },
  {
    key: "user-profile",
    title: "Mijn profiel",
    url: "/user-profile",
    icon: UserIcon as IconSvgElement,
  },
  {
    key: "organization-profile",
    title: "Organisatieprofiel",
    url: "/organization-profile",
    icon: CubeIcon as IconSvgElement,
  },
];

export const PROTOTYPE_NAV_GROUPS: PrototypeNavGroup[] = [
  {
    key: "certification",
    label: "Certificatie",
    items: [
      {
        key: "requests",
        title: "Aanvragen",
        url: "/requests",
        icon: FileEditIcon as IconSvgElement,
      },
      {
        key: "certificates-attestations",
        title: "Certificaten & Attesten",
        url: "/certificates-attestations",
        icon: Award01Icon as IconSvgElement,
      },
    ],
  },
  {
    key: "finance",
    label: "Financieel",
    items: [
      {
        key: "orders",
        title: "Bestellingen",
        url: "/orders",
        icon: ShoppingBasket01Icon as IconSvgElement,
      },
      {
        key: "invoices",
        title: "Facturen",
        url: "/invoices",
        icon: Invoice01Icon as IconSvgElement,
      },
    ],
  },
  {
    key: "demo",
    label: "Demo",
    items: [
      {
        key: "organization",
        title: "Organisatie",
        url: "/organization",
        icon: Setting06Icon as IconSvgElement,
      },
      {
        key: "categorization",
        title: "Beslissingsboom",
        url: "/categorization",
        icon: HierarchySquare02Icon as IconSvgElement,
      },
      {
        key: "design",
        title: "Design system",
        url: "/design-system",
        icon: BookOpen01Icon as IconSvgElement,
      },
    ],
  },
];

export const PROTOTYPE_SECONDARY_NAV: PrototypeNavItem[] = [
  { key: "help", title: "Help", url: "#", icon: HelpCircleIcon as IconSvgElement },
  { key: "settings", title: "Settings", url: "#", icon: Setting06Icon as IconSvgElement },
];
