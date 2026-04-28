import type { ComponentType } from "react";
import { usePanelsContext } from "@procertus-ui/ui";

import {
  REQUEST_DETAIL_PANEL_TYPE,
  RequestDetailPanel,
} from "./request_detail_panel";

export const panelRegistry = {
  [REQUEST_DETAIL_PANEL_TYPE]: RequestDetailPanel,
} satisfies Record<string, ComponentType<any>>;

export type AppPanelRegistry = typeof panelRegistry;

export function useAppPanels() {
  return usePanelsContext<AppPanelRegistry>();
}
