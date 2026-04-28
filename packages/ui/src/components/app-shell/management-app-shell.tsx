import * as React from "react";

import { AppHeader, type AppHeaderProps } from "@/components/app-header";
import { AppSidebar, type AppSidebarProps } from "@/components/app-sidebar";
import { AlertDialogProvider } from "@/components/ui/alert-dialog-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type ManagementAppShellProps = {
  sidebar: AppSidebarProps;
  header: AppHeaderProps;
  children: React.ReactNode;
  mainClassName?: string;
};

function ManagementAppShell({ sidebar, header, children, mainClassName }: ManagementAppShellProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AlertDialogProvider>
      <SidebarProvider className="h-svh overflow-hidden">
        <AppSidebar {...sidebar} />
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-sidebar">
          <div className="shrink-0 bg-sidebar">
            <AppHeader {...header} />
            <div
              className="pointer-events-none mx-section -mb-8 h-8 bg-linear-to-b from-sidebar to-transparent transition-opacity duration-200"
              style={{ opacity: scrolled ? 1 : 0 }}
            />
          </div>
          <div className="mx-section flex min-h-0 flex-1 flex-col overflow-hidden pb-section">
            <main className={cn("min-h-0 flex-1 overflow-hidden rounded-xl bg-background p-boundary", mainClassName)}>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AlertDialogProvider>
  );
}

export { ManagementAppShell };
