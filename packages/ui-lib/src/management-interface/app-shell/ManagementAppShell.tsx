import * as React from "react";

import { SidebarProvider } from "@procertus-ui/ui";

import { ManagementHeader, type ManagementHeaderProps } from "./ManagementHeader";
import { ManagementSidebar, type ManagementSidebarProps } from "./ManagementSidebar";

export type ManagementAppShellProps = {
  sidebar: ManagementSidebarProps;
  header: ManagementHeaderProps;
  children: React.ReactNode;
};

function ManagementAppShell({ sidebar, header, children }: ManagementAppShellProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SidebarProvider>
      <ManagementSidebar {...sidebar} />
      <div className="flex min-h-svh flex-1 flex-col bg-sidebar">
        <div className="sticky top-0 z-20 bg-sidebar">
          <ManagementHeader {...header} />
          <div
            className="pointer-events-none mx-component -mb-8 h-8 bg-gradient-to-b from-sidebar to-transparent transition-opacity duration-200"
            style={{ opacity: scrolled ? 1 : 0 }}
          />
        </div>
        <div className="mx-component flex flex-1 flex-col pb-component">
          <main className="flex-1 rounded-xl bg-background p-element">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export { ManagementAppShell };
