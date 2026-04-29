import { useMockPrototypeSession } from "@procertus-ui/ui-pt1-prototype";

import { H1 } from "@procertus-ui/ui";
import { PageHeader } from "@procertus-ui/ui-lib";

import {
  CertificationSummaryWidget,
  LatestInvoicesWidget,
  RecentNotificationsWidget,
  SessionContextWidget,
} from "./dashboard-widgets";

export function DashboardPage() {
  const session = useMockPrototypeSession();

  const user = session?.user;
  const activeOrganization = session?.activeOrganization;
  const contextOrganization = activeOrganization ?? user?.homeOrganization;

  return (
    <div className="flex w-full max-w-[1400px] flex-col gap-region px-4 py-6 text-left md:px-6 md:py-8">
      <PageHeader
        kicker="Extranet prototype"
        title={<H1>Welkom op het PROCERTUS klantenportaal</H1>}
        description="Overzicht van uw sessie, organisatie en certificatie-aanvragen zoals in deze demo beschikbaar zijn."
        media={
          <img
            src="/Procertus Logo with tagline.svg"
            alt="Procertus"
            className="h-16 w-auto max-w-[min(100%,240px)] object-contain sm:h-18"
          />
        }
      />

      <div className="grid grid-cols-12 items-stretch gap-region">
        {user && contextOrganization ? (
          <div className="col-span-12 flex min-h-0 flex-col gap-region lg:col-span-4 lg:h-full">
            <SessionContextWidget className="shrink-0" user={user} contextOrganization={contextOrganization} />
            <LatestInvoicesWidget className="min-h-0 flex-1" />
          </div>
        ) : null}

        <div className="col-span-12 flex min-h-0 lg:col-span-5 lg:h-full">
          <CertificationSummaryWidget className="min-h-0 w-full flex-1" />
        </div>

        <RecentNotificationsWidget className="col-span-12 min-h-0 lg:col-span-3 lg:h-full" />
      </div>
    </div>
  );
}
