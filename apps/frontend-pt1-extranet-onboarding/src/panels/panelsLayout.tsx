import type { ReactNode } from "react";
import {
  PanelsLayout,
  useUrlQueryPersistence,
} from "@procertus-ui/ui";

import { panelRegistry } from "./panelRegistry";

export function EuroCannicPanelsLayout({ children }: { children: ReactNode }) {
  const persistenceLayer = useUrlQueryPersistence();

  return (
    <PanelsLayout
      panelTypes={panelRegistry}
      persistenceLayer={persistenceLayer}
      panelWidth={520}
      className="h-full min-h-0 bg-sidebar"
    >
      {children}
    </PanelsLayout>
  );
}

export { EuroCannicPanelsLayout as AppPanelsLayout };
