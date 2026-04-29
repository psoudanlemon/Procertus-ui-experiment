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
  const mainRef = React.useRef<React.ElementRef<"main">>(null);

  React.useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AlertDialogProvider>
      {/*
        Fill the panels main region (h-full min-h-0) instead of forcing 100svh so scroll stays
        inside <main> when nested under PanelsLayout.
      */}
      <SidebarProvider className="flex h-full min-h-0 w-full max-h-full overflow-hidden">
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
            <main
              ref={mainRef}
              className={cn(
                "min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl bg-background p-boundary",
                mainClassName,
              )}
            >
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AlertDialogProvider>
  );
}

export { ManagementAppShell };
