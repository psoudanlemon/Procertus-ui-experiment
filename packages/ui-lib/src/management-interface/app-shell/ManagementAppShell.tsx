import * as React from "react";

import {
  AppHeader,
  type AppHeaderProps,
  AppSidebar,
  type AppSidebarProps,
  SidebarProvider,
} from "@procertus-ui/ui";

export type ManagementAppShellProps = {
  sidebar: AppSidebarProps;
  header: AppHeaderProps;
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
      <AppSidebar {...sidebar} />
      <div className="flex min-h-svh flex-1 flex-col bg-sidebar">
        <div className="sticky top-0 z-20 bg-sidebar">
          <AppHeader {...header} />
          <div
            className="pointer-events-none mx-section -mb-8 h-8 bg-gradient-to-b from-sidebar to-transparent transition-opacity duration-200"
            style={{ opacity: scrolled ? 1 : 0 }}
          />
        </div>
        <div className="mx-section flex flex-1 flex-col pb-section">
          <main className="flex-1 rounded-xl bg-background p-boundary">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export { ManagementAppShell };
