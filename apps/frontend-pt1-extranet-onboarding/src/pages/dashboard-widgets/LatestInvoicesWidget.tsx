import { HugeiconsIcon } from "@hugeicons/react";
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

import { mockLatestInvoices } from "../dashboard-mock-data";
import { DASHBOARD_FLAT_CARD_CHROME_CLASS, dashboardFlatCardClassName } from "./constants";
import { navItemByKey } from "./nav";

export type LatestInvoicesWidgetProps = {
  className?: string;
};

export function LatestInvoicesWidget({ className }: LatestInvoicesWidgetProps) {
  const session = useMockPrototypeSession();
  const contextOrganization = session?.activeOrganization ?? session?.user?.homeOrganization;
  const organizationId = contextOrganization?.id ?? "org-procertus";
  const latestInvoices = mockLatestInvoices(organizationId);
  const invoicesNav = navItemByKey("invoices")!;

  return (
    <Card className={dashboardFlatCardClassName(cn("h-full", className))}>
      <CardHeader
        className={cn(
          "flex flex-row items-start gap-component pb-0",
          DASHBOARD_FLAT_CARD_CHROME_CLASS,
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <HugeiconsIcon icon={invoicesNav.icon} size={22} strokeWidth={iconStroke(22)} />
        </div>
        <div className="flex min-w-0 flex-col gap-micro">
          <CardTitle className="text-base">Laatste facturen</CardTitle>
          <CardDescription className="text-xs">Drie meest recente facturen.</CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className={cn("flex flex-col gap-section pt-0 text-sm", DASHBOARD_FLAT_CARD_CHROME_CLASS)}
      >
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Recente Facturen
        </h4>
        <ItemGroup className="gap-component">
          {latestInvoices.map((invoice) => (
            <Item
              key={invoice.id}
              variant="muted"
              size="sm"
              role="listitem"
              className="items-center"
            >
              <ItemContent className="min-w-0">
                <ItemTitle className="w-full max-w-full">{invoice.reference}</ItemTitle>
                <ItemDescription className="mt-0 flex w-full items-center gap-micro">
                  <Badge
                    variant={invoice.paid ? "success" : "secondary"}
                    className="text-[10px] font-medium"
                  >
                    {invoice.paid ? "Betaald" : "Openstaand"}
                  </Badge>
                </ItemDescription>
              </ItemContent>
              <ItemActions className="shrink-0 justify-end pl-component">
                <span className="text-right font-semibold tabular-nums text-foreground">
                  {invoice.amount}
                </span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
        <Button variant="link" className="h-auto justify-start p-0 text-sm" asChild>
          <Link to={invoicesNav.url}>Toon alle facturen</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
