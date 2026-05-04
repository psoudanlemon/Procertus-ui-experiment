import * as React from "react";

import { AppHeader, type AppHeaderProps } from "@/components/app-header";
import { AppSidebar, type AppSidebarProps } from "@/components/app-sidebar";
import { Footer, type FooterProps } from "@/components/footer";
import { AlertDialogProvider } from "@/components/ui/alert-dialog-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type ManagementAppShellProps = {
  sidebar: AppSidebarProps;
  header: AppHeaderProps;
  footer?: FooterProps;
  children: React.ReactNode;
  mainClassName?: string;
};

function ManagementAppShell({ sidebar, header, footer, children, mainClassName }: ManagementAppShellProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AlertDialogProvider>
      {/*
        Scroll lives on the outer right-hand column, not on <main>. Main flows at its
        natural height; the footer follows it and only appears once you scroll past
        all of main's content.
      */}
      <SidebarProvider className="flex h-full min-h-0 w-full max-h-full overflow-hidden">
        <AppSidebar {...sidebar} />
        <div
          ref={scrollRef}
          className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto bg-sidebar"
        >
          <div className="sticky top-0 z-10 shrink-0 bg-sidebar">
            <AppHeader {...header} />
            <div
              className="pointer-events-none mx-section -mb-8 h-8 bg-linear-to-b from-sidebar to-transparent transition-opacity duration-200"
              style={{ opacity: scrolled ? 1 : 0 }}
            />
          </div>
          <div className="mx-section flex min-h-full flex-col pb-section">
            <main
              className={cn(
                "rounded-xl bg-background p-boundary",
                mainClassName,
              )}
            >
              {children}
            </main>
            {footer && (
              <div className="mt-auto shrink-0">
                <Footer {...footer} />
              </div>
            )}
          </div>
        </div>
      </SidebarProvider>
    </AlertDialogProvider>
  );
}

export { ManagementAppShell };
