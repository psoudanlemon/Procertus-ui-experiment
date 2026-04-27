import type { AppHeaderProps, AppSidebarProps } from "@procertus-ui/ui";
import { useSidebar } from "@procertus-ui/ui";
import logomark from "@procertus-ui/ui/assets/logomark.svg";
import { ManagementAppShell } from "@procertus-ui/ui-lib";
import { useLayoutEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useMockPrototypeLogout, useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";
import { PROTOTYPE_PRIMARY_NAV, PROTOTYPE_SECONDARY_NAV } from "../navConfig";

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
  const session = useMockPrototypeSession();
  const logout = useMockPrototypeLogout();
  const pathname = location.pathname;
  const flushMain = pathname === "/requests/create" || pathname.endsWith("/edit");

  const sidebar: AppSidebarProps = useMemo(() => {
    const workspaceId = session?.user.homeOrganization.id ?? "prototype";
    const workspaceName = session?.user.homeOrganization.name ?? "Workspace";
    const plan = session
      ? `Represents ${session.user.representedOrganization.name}`
      : "Demo workspace";
    return {
      workspaces: [
        {
          id: workspaceId,
          name: workspaceName,
          logo: (
            <img
              src={logomark}
              alt="Prototype organization"
              className="size-full rounded-sm object-contain"
            />
          ),
          plan,
        },
      ],
      activeWorkspaceId: workspaceId,
      showSearch: false,
      stickyNav: false,
      navItems: PROTOTYPE_PRIMARY_NAV.map((item) => ({
        title: item.title,
        url: item.url,
        icon: item.icon,
        isActive: item.url === "/requests" ? pathname.startsWith("/requests") : pathname.startsWith(item.url),
      })),
      navGroups: [],
      secondaryItems: PROTOTYPE_SECONDARY_NAV.map((item) => ({
        title: item.title,
        url: item.url,
        icon: item.icon,
      })),
      NavLink: Link,
    };
  }, [pathname, session]);

  const header: AppHeaderProps = useMemo(() => {
    const crumb =
      PROTOTYPE_PRIMARY_NAV.find((item) =>
        item.url === "/requests" ? pathname.startsWith("/requests") : pathname.startsWith(item.url),
      )?.title ?? "Aanvragen";
    const user = session?.user;
    return {
      showNavigation: false,
      breadcrumbs: [{ label: "Workspace", href: "/requests" }, { label: crumb }],
      user: user
        ? {
            name: user.displayName,
            email: user.email,
            role: user.role ?? "Prototype session",
          }
        : {
            name: "Guest",
            email: "",
            role: "",
          },
      onSignOut: () => {
        logout();
        navigate("/welcome", { replace: true });
      },
      NavLink: Link,
    };
  }, [pathname, navigate, logout, session]);

  return (
    <ManagementAppShell sidebar={sidebar} header={header} mainClassName={flushMain ? "p-0!" : undefined}>
      <CloseMobileSidebarOnRouteChange />
      <Outlet />
    </ManagementAppShell>
  );
}
