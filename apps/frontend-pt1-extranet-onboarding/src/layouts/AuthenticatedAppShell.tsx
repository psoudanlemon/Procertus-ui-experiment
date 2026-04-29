import type { AppHeaderProps, AppSidebarProps } from "@procertus-ui/ui";
import { AlertDialogProvider, ManagementAppShell, useSidebar } from "@procertus-ui/ui";
import logomark from "@procertus-ui/ui/assets/logomark.svg";
import { useLayoutEffect, useMemo } from "react";
import { Link, matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  useMockPrototypeLogout,
  useMockPrototypeSession,
  useMockPrototypeSetActiveOrganization,
} from "@procertus-ui/ui-pt1-prototype";
import { PROTOTYPE_NAV_GROUPS, PROTOTYPE_PRIMARY_NAV, PROTOTYPE_SECONDARY_NAV } from "../navConfig";
import { AppPanelsLayout } from "../panels";

const isNavItemActive = (itemUrl: string, pathname: string) => {
  const pattern = itemUrl === "/requests" ? "/requests/*" : itemUrl;
  return Boolean(matchPath({ path: pattern, end: itemUrl !== "/requests" }, pathname));
};

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
  const setActiveOrganization = useMockPrototypeSetActiveOrganization();
  const logout = useMockPrototypeLogout();
  const pathname = location.pathname;
  const flushMain = pathname === "/requests/create" || pathname.endsWith("/edit");

  const sidebar: AppSidebarProps = useMemo(() => {
    const workspaceId = session?.activeOrganization.id ?? "prototype";
    const workspaceName = session?.activeOrganization.name ?? "Workspace";
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
        isActive: isNavItemActive(item.url, pathname),
      })),
      navGroups: PROTOTYPE_NAV_GROUPS.map((group) => ({
        label: group.label,
        items: group.items.map((item) => ({
          title: item.title,
          url: item.url,
          icon: item.icon,
          isActive: isNavItemActive(item.url, pathname),
        })),
      })),
      secondaryItems: PROTOTYPE_SECONDARY_NAV.map((item) => ({
        title: item.title,
        url: item.url,
        icon: item.icon,
      })),
      NavLink: Link,
    };
  }, [pathname, session]);

  const header: AppHeaderProps = useMemo(() => {
    const groupedNavItems = PROTOTYPE_NAV_GROUPS.flatMap((group) => group.items);
    const allSidebarNavItems = [...PROTOTYPE_PRIMARY_NAV, ...groupedNavItems];
    const crumb =
      allSidebarNavItems.find((item) => isNavItemActive(item.url, pathname))?.title ?? "Aanvragen";
    const user = session?.user;
    const activeOrganization = session?.activeOrganization;
    const organizations = session?.organizations;
    const userProfileHref =
      PROTOTYPE_PRIMARY_NAV.find((item) => item.key === "user-profile")?.url ?? "/user-profile";
    const organizationProfileHref =
      PROTOTYPE_PRIMARY_NAV.find((item) => item.key === "organization-profile")?.url ??
      "/organization-profile";
    const showOrgSwitcher = organizations !== undefined && organizations.length > 1;
    return {
      showNavigation: false,
      breadcrumbs: [{ label: "Workspace", href: "/" }, { label: crumb }],
      user:
        user && activeOrganization
          ? {
              name: user.displayName,
              email: user.email,
              role: user.role ?? "Prototype session",
              profileHref: userProfileHref,
              profileLabel: "Mijn profiel",
              company: {
                name: activeOrganization.name,
                description:
                  user.representedOrganization.id !== activeOrganization.id
                    ? `Vertegenwoordigt: ${user.representedOrganization.name}`
                    : undefined,
                organizationProfileHref,
                organizationProfileLabel: "Organisatieprofiel",
                organizationSwitcher: showOrgSwitcher
                  ? {
                      organizations: organizations.map((o) => ({ id: o.id, name: o.name })),
                      activeOrganizationId: activeOrganization.id,
                      onSelectOrganization: setActiveOrganization,
                    }
                  : undefined,
              },
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
  }, [pathname, navigate, logout, session, setActiveOrganization]);

  return (
    <AlertDialogProvider>
      <div className="h-full min-h-0 w-full">
        <AppPanelsLayout>
          <ManagementAppShell
            sidebar={sidebar}
            header={header}
            mainClassName={flushMain ? "p-0!" : undefined}
          >
            <CloseMobileSidebarOnRouteChange />
            <Outlet />
          </ManagementAppShell>
        </AppPanelsLayout>
      </div>
    </AlertDialogProvider>
  );
}
