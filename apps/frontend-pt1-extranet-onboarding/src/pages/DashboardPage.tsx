import { useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";

import { H1, PageHeader, cn } from "@procertus-ui/ui";

import {
  CertificationSummaryWidget,
  LatestInvoicesWidget,
  RecentNotificationsWidget,
  SessionContextWidget,
} from "./dashboard-widgets";
import { dashboardContainerClass } from "./dashboard-widgets/constants";

export function DashboardPage() {
  const session = useMockPrototypeSession();

  const user = session?.user;
  const activeOrganization = session?.activeOrganization;
  const contextOrganization = activeOrganization ?? user?.homeOrganization;

  return (
    <div
      className={cn(
        dashboardContainerClass,
        "flex w-full max-w-[1400px] flex-col gap-region px-4 py-6 text-left",
        "@min-[40rem]/dashboard:px-6 @min-[40rem]/dashboard:py-8",
      )}
    >
      <PageHeader
        kicker="Extranet prototype"
        title={<H1>Welkom op het PROCERTUS klantenportaal</H1>}
        description="Overzicht van je sessie, organisatie en certificatieaanvragen."
        media={
          <img
            src="/Procertus Logo with tagline.svg"
            alt="Procertus"
            className="h-16 w-auto max-w-[min(100%,240px)] object-contain @min-[48rem]/page-header:h-18"
          />
        }
      />

      <div className="grid grid-cols-12 items-stretch gap-region">
        {user && contextOrganization ? (
          <div
            className={cn(
              "col-span-12 flex min-h-0 flex-col gap-region",
              "@min-[48rem]/dashboard:col-span-5",
              "@min-[64rem]/dashboard:col-span-4 @min-[64rem]/dashboard:h-full",
            )}
          >
            <SessionContextWidget className="shrink-0" user={user} contextOrganization={contextOrganization} />
            <LatestInvoicesWidget className="min-h-0 flex-1" />
          </div>
        ) : null}

        <div
          className={cn(
            "col-span-12 flex min-h-0",
            "@min-[48rem]/dashboard:col-span-7",
            "@min-[64rem]/dashboard:col-span-5 @min-[64rem]/dashboard:h-full",
          )}
        >
          <CertificationSummaryWidget className="min-h-0 w-full flex-1" />
        </div>

        <RecentNotificationsWidget
          className={cn(
            "col-span-12 min-h-0",
            "@min-[64rem]/dashboard:col-span-3 @min-[64rem]/dashboard:h-full",
          )}
        />
      </div>
    </div>
  );
}
