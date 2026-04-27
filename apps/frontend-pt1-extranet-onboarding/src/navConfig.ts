import type { IconSvgElement } from "@hugeicons/react";
import {
  BookOpen01Icon,
  HelpCircleIcon,
  HierarchySquare02Icon,
  Home01Icon,
  Setting06Icon,
} from "@hugeicons/core-free-icons";

export type PrototypeNavItem = {
  key: string;
  title: string;
  url: string;
  icon: IconSvgElement;
};

export const PROTOTYPE_PRIMARY_NAV: PrototypeNavItem[] = [
  { key: "requests", title: "Aanvragen", url: "/requests", icon: Home01Icon as IconSvgElement },
  { key: "organization", title: "Organisatie", url: "/app/organization", icon: Setting06Icon as IconSvgElement },
  {
    key: "categorization",
    title: "Beslissingsboom",
    url: "/app/categorization",
    icon: HierarchySquare02Icon as IconSvgElement,
  },
  { key: "design", title: "Design system", url: "/app/design-system", icon: BookOpen01Icon as IconSvgElement },
];

export const PROTOTYPE_SECONDARY_NAV: PrototypeNavItem[] = [
  { key: "help", title: "Help", url: "#", icon: HelpCircleIcon as IconSvgElement },
  { key: "settings", title: "Settings", url: "#", icon: Setting06Icon as IconSvgElement },
];
