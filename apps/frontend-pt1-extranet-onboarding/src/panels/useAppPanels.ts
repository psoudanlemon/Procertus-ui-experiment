import { usePanelsContext } from "@procertus-ui/ui";

import type { AppPanelRegistry } from "./panelRegistry";

export function useAppPanels() {
  return usePanelsContext<AppPanelRegistry>();
}
