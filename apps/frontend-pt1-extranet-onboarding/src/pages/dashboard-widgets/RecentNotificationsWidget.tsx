import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  cn,
  iconStroke,
} from "@procertus-ui/ui";

import type { DashboardNotificationModule } from "../dashboard-mock-data";
import { mockRecentNotifications } from "../dashboard-mock-data";
import { DASHBOARD_FLAT_CARD_CHROME_CLASS, dashboardFlatCardClassName } from "./constants";
import { navItemByKey } from "./nav";

const formatNotificationInstant = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

function moduleNavIcon(module: DashboardNotificationModule) {
  if (module === "user-management") return navItemByKey("user-management")!.icon;
  if (module === "certification") return navItemByKey("requests")!.icon;
  return navItemByKey("invoices")!.icon;
}

export type RecentNotificationsWidgetProps = {
  className?: string;
};

export function RecentNotificationsWidget({ className }: RecentNotificationsWidgetProps) {
  const notifications = mockRecentNotifications();

  return (
    <Card
      className={dashboardFlatCardClassName(
        cn("flex min-h-0 flex-col text-sm lg:h-full", className),
      )}
    >
      <CardHeader
        className={cn(
          "shrink-0 flex flex-row items-start gap-component pb-0",
          DASHBOARD_FLAT_CARD_CHROME_CLASS,
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <HugeiconsIcon icon={Notification01Icon} size={22} strokeWidth={iconStroke(22)} />
        </div>
        <div className="flex min-w-0 flex-col gap-micro">
          <CardTitle className="text-base">Meldingen</CardTitle>
          <CardDescription className="text-xs">
            Recente wijzigingen uit gebruikersbeheer, certificatie en facturatie (voorbeelddata).
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-section overflow-hidden pt-0 text-sm",
          DASHBOARD_FLAT_CARD_CHROME_CLASS,
        )}
      >
        <h4 className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Recente meldingen
        </h4>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ItemGroup className="gap-component">
            {notifications.map((notification) => (
              <Item
                key={notification.id}
                variant={"outline"}
                size="sm"
                role="listitem"
                className="items-start"
              >
                <ItemMedia variant="icon">
                  <HugeiconsIcon
                    icon={moduleNavIcon(notification.module)}
                    size={18}
                    strokeWidth={iconStroke(18)}
                    className="text-muted-foreground"
                    aria-hidden
                  />
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemTitle className="line-clamp-none w-full max-w-full whitespace-normal text-left">
                    {notification.message}
                  </ItemTitle>
                  <ItemDescription className="mt-0 text-[11px] tabular-nums text-muted-foreground">
                    {formatNotificationInstant(notification.occurredAt)}
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  );
}
