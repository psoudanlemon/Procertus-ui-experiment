import type { IconSvgElement } from "@hugeicons/react";
import {
  BookOpen01Icon,
  HelpCircleIcon,
  Home01Icon,
  Setting06Icon,
} from "@hugeicons/core-free-icons";
import type { AppHeaderProps, AppSidebarProps } from "@procertus-ui/ui";
import { useSidebar } from "@procertus-ui/ui";
import logomark from "@procertus-ui/ui/assets/logomark.svg";
import { ManagementAppShell } from "@procertus-ui/ui-lib";
import { useLayoutEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { usePrototypeSession } from "../auth/usePrototypeSession";

/** Collapses the mobile sheet after in-app navigation so the new page isn’t hidden behind the drawer. */
function CloseMobileSidebarOnRouteChange() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  useLayoutEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  return null;
}

/**
 * Management application shell (sidebar + `AppHeader`) for signed-in users — matches ui-lib shell composition.
 */
export function AuthenticatedAppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = usePrototypeSession();
  const pathname = location.pathname;

  const sidebar: AppSidebarProps = useMemo(() => {
    const isHome = pathname === "/app" || pathname === "/app/";
    const isDesign = pathname.startsWith("/app/design-system");
    return {
      workspaces: [
        {
          id: "prototype",
          name: "Prototype org",
          logo: (
            <img
              src={logomark}
              alt="Prototype organization"
              className="size-full rounded-sm object-contain"
            />
          ),
          plan: "Demo workspace",
        },
      ],
      activeWorkspaceId: "prototype",
      showSearch: false,
      stickyNav: false,
      navItems: [
        {
          title: "Home",
          url: "/app",
          icon: Home01Icon as IconSvgElement,
          isActive: isHome,
        },
        {
          title: "Design system",
          url: "/app/design-system",
          icon: BookOpen01Icon as IconSvgElement,
          isActive: isDesign,
        },
      ],
      navGroups: [],
      secondaryItems: [
        { title: "Help", url: "#", icon: HelpCircleIcon as IconSvgElement },
        { title: "Settings", url: "#", icon: Setting06Icon as IconSvgElement },
      ],
      NavLink: Link,
    };
  }, [pathname]);

  const header: AppHeaderProps = useMemo(() => {
    const crumb = pathname.startsWith("/app/design-system") ? "Design system" : "Overview";
    return {
      showNavigation: false,
      breadcrumbs: [{ label: "Workspace", href: "/app" }, { label: crumb }],
      user: {
        name: "Demo user",
        email: "demo.user@prototype.local",
        role: "Prototype session",
      },
      onSignOut: () => {
        signOut();
        navigate("/welcome", { replace: true });
      },
      NavLink: Link,
    };
  }, [pathname, navigate, signOut]);

  return (
    <ManagementAppShell sidebar={sidebar} header={header}>
      <CloseMobileSidebarOnRouteChange />
      <Outlet />
    </ManagementAppShell>
  );
}
