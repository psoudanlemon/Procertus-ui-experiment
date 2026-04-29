import { PROTOTYPE_NAV_GROUPS, PROTOTYPE_PRIMARY_NAV, type PrototypeNavItem } from "../../navConfig";

export function navItemByKey(key: string): PrototypeNavItem | undefined {
  const primary = PROTOTYPE_PRIMARY_NAV.find((i) => i.key === key);
  if (primary) return primary;
  for (const group of PROTOTYPE_NAV_GROUPS) {
    const found = group.items.find((i) => i.key === key);
    if (found) return found;
  }
  return undefined;
}
