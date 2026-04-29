import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CertificationRequestLifecycleStatus } from "@procertus-ui/ui-certification";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  cn,
  iconStroke,
} from "@procertus-ui/ui";
import { useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";
import { Link } from "react-router-dom";

import {
  requestStatus,
  requestTitle,
  useAuthenticatedRequests,
} from "../../features/requests/authenticatedRequestStore";
import { mockActiveCertificateCount } from "../dashboard-mock-data";
import { REQUEST_DETAIL_PANEL_TYPE, useAppPanels } from "../../panels";
import { DASHBOARD_FLAT_CARD_CHROME_CLASS, dashboardFlatCardClassName } from "./constants";
import { navItemByKey } from "./nav";

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("nl-BE", {
        day: "numeric",
        month: "short",
      }).format(new Date(value))
    : undefined;

function statusBadgeVariant(
  status: CertificationRequestLifecycleStatus,
): "default" | "secondary" | "success" | "warning" | "info" | "destructive" | "outline" {
  if (status === "draft") return "outline";
  if (status === "submitted") return "secondary";
  if (status === "in-progress") return "info";
  if (status === "approved") return "success";
  if (status === "rejected" || status === "cancelled") return "destructive";
  return "secondary";
}

export type CertificationSummaryWidgetProps = {
  className?: string;
};

export function CertificationSummaryWidget({ className }: CertificationSummaryWidgetProps) {
  const session = useMockPrototypeSession();
  const [requests] = useAuthenticatedRequests();
  const { openPanel } = useAppPanels();

  const contextOrganization = session?.activeOrganization ?? session?.user?.homeOrganization;
  const organizationId = contextOrganization?.id ?? "org-procertus";
  const activeCertificateCount = mockActiveCertificateCount(organizationId);

  const sortedForList = [...requests].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  const latestRequestPreview = sortedForList.slice(0, 3);

  const requestsNav = navItemByKey("requests")!;
  const certificatesNav = navItemByKey("certificates-attestations")!;

  return (
    <Card className={dashboardFlatCardClassName(cn("h-full", className))}>
      <CardHeader
        className={cn(
          "flex flex-row items-start gap-component pb-0",
          DASHBOARD_FLAT_CARD_CHROME_CLASS,
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <HugeiconsIcon icon={requestsNav.icon} size={22} strokeWidth={iconStroke(22)} />
        </div>
        <div className="flex min-w-0 flex-col gap-micro">
          <CardTitle className="text-base">Certificatie</CardTitle>
          <CardDescription className="text-xs">
            Laatste aanvragen en actieve certificaten voor uw organisatie.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className={cn("flex flex-col gap-section pt-0 text-sm", DASHBOARD_FLAT_CARD_CHROME_CLASS)}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Recente aanvragen
        </p>
        {latestRequestPreview.length > 0 ? (
          <ItemGroup className="gap-component">
            {latestRequestPreview.map((request) => (
              <Item key={request.id} variant="muted" size="sm" asChild>
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "flex w-full min-w-0 flex-wrap items-center gap-component text-left",
                    "cursor-pointer transition-colors hover:bg-muted/80 active:bg-muted",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                  onClick={() => openPanel(REQUEST_DETAIL_PANEL_TYPE, { requestId: request.id })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openPanel(REQUEST_DETAIL_PANEL_TYPE, { requestId: request.id });
                    }
                  }}
                  aria-label={`${requestTitle(request)}: details in zijpaneel`}
                >
                  <ItemContent className="min-w-0 flex-1">
                    <ItemTitle className="max-w-full">{requestTitle(request)}</ItemTitle>
                    {formatDate(request.updatedAt) ? (
                      <ItemDescription>Bijgewerkt {formatDate(request.updatedAt)}</ItemDescription>
                    ) : null}
                  </ItemContent>
                  <ItemActions className="shrink-0 gap-micro">
                    <Badge
                      variant={statusBadgeVariant(request.status)}
                      className="text-[10px] font-medium"
                    >
                      {requestStatus(request)}
                    </Badge>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={16}
                      strokeWidth={iconStroke(16)}
                      className="shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  </ItemActions>
                </div>
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <p className="text-xs text-muted-foreground">Geen recente aanvragen.</p>
        )}

        <div className="flex items-center justify-between gap-component rounded-lg bg-muted/25 px-component py-component dark:bg-muted/10">
          <span className="text-muted-foreground">Actieve certificaten</span>
          <span className="text-xl font-semibold tabular-nums text-foreground">
            {activeCertificateCount}
          </span>
        </div>

        <div className="flex flex-col gap-micro pt-micro sm:flex-row sm:flex-wrap sm:gap-component">
          <Button variant="link" className="h-auto justify-start p-0 text-sm" asChild>
            <Link to={requestsNav.url}>Toon alle aanvragen</Link>
          </Button>
          <Button variant="link" className="h-auto justify-start p-0 text-sm" asChild>
            <Link to={certificatesNav.url}>Toon alle certificaten</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
