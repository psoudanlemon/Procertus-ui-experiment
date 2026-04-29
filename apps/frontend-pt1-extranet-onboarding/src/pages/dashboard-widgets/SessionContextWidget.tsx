import type { MockPrototypeOrganization, MockPrototypeUser } from "@procertus-ui/ui-pt1-prototype";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
  iconStroke,
} from "@procertus-ui/ui";
import { Link } from "react-router-dom";

import { mockOrganizationAddress, mockOrganizationUserCount } from "../dashboard-mock-data";
import { DASHBOARD_FLAT_CARD_CHROME_CLASS, dashboardFlatCardClassName } from "./constants";
import { navItemByKey } from "./nav";

function initialsFromDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]!}${parts[parts.length - 1]![0]!}`.toUpperCase();
}

const interactiveNameClass = cn(
  "rounded-sm font-semibold text-foreground outline-none transition-colors",
  "hover:text-primary hover:underline",
  "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);

export type SessionContextWidgetProps = {
  className?: string;
  user: MockPrototypeUser;
  contextOrganization: MockPrototypeOrganization;
};

export function SessionContextWidget({
  className,
  user,
  contextOrganization,
}: SessionContextWidgetProps) {
  const userMgmt = navItemByKey("user-management")!;
  const userProfile = navItemByKey("user-profile")!;
  const orgProfile = navItemByKey("organization-profile")!;
  const organizationUserCount = mockOrganizationUserCount(contextOrganization.id);
  const organizationAddress = mockOrganizationAddress(contextOrganization.id);

  return (
    <Card className={dashboardFlatCardClassName(cn("text-sm", className))}>
      <CardContent
        className={cn("flex flex-col gap-component pt-0", DASHBOARD_FLAT_CARD_CHROME_CLASS)}
      >
        <div className="flex items-start gap-component">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {initialsFromDisplayName(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-muted-foreground">Ingelogd als</p>
            <Link
              to={userProfile.url}
              className={cn(interactiveNameClass, "inline-block max-w-full leading-tight")}
            >
              {user.displayName}
            </Link>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            {user.role ? (
              <Badge variant="secondary" className="mt-micro w-fit font-normal">
                {user.role}
              </Badge>
            ) : null}
          </div>
        </div>

        <Item variant="muted" size="sm" className="items-center">
          <ItemMedia variant="icon">
            <HugeiconsIcon
              icon={orgProfile.icon}
              size={18}
              strokeWidth={iconStroke(18)}
              className="text-muted-foreground"
              aria-hidden
            />
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="w-full max-w-full">
              <Link to={orgProfile.url} className={cn(interactiveNameClass, "inline max-w-full")}>
                {contextOrganization.name}
              </Link>
            </ItemTitle>

            <ItemDescription className="mt-0">{organizationAddress}</ItemDescription>
          </ItemContent>
          <ItemActions className="shrink-0 self-center pl-component">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={userMgmt.url}
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold tabular-nums text-primary outline-none transition-colors",
                    "hover:bg-primary/20 hover:text-primary",
                    "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                  aria-label={`${userMgmt.title}: ${organizationUserCount} gebruikers`}
                >
                  {organizationUserCount}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[240px] text-center sm:text-left">
                Aantal Gebruikers
              </TooltipContent>
            </Tooltip>
          </ItemActions>
        </Item>
      </CardContent>
    </Card>
  );
}
