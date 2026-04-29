import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, H1, iconStroke } from "@procertus-ui/ui";
import { PageHeader } from "@procertus-ui/ui-lib";
import { useCallback, useMemo } from "react";

import { ProfileChangeRequestOverviewCard } from "../components/profile-change-requests/ProfileChangeRequestOverviewCard";
import { useProfileChangeRequests } from "../features/profile-change-requests/use-profile-change-requests";
import { isPendingProfileChangeStatus } from "../features/profile-change-requests/types";
import { PROFILE_CHANGE_DETAIL_PANEL_TYPE, useAppPanels } from "../panels";

export function ProfileChangeRequestsPage() {
  const { openPanel } = useAppPanels();
  const { requests } = useProfileChangeRequests();

  const sorted = useMemo(
    () =>
      [...requests]
        .filter((r) => isPendingProfileChangeStatus(r.status))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [requests],
  );

  const openDetail = useCallback(
    (requestId: string) => {
      openPanel(PROFILE_CHANGE_DETAIL_PANEL_TYPE, { requestId });
    },
    [openPanel],
  );

  const icon = (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
      <HugeiconsIcon icon={FileEditIcon as IconSvgElement} size={22} strokeWidth={iconStroke(22)} />
    </div>
  );

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-region px-4 py-6 text-left md:px-6 md:py-8">
      <PageHeader
        icon={icon}
        kicker="Beheer"
        title={<H1 className="text-balance">Profielwijzigingen</H1>}
        description="Overzicht van ingediende profielwijzigingen. Open een kaart voor details, tijdlijn en conversatie."
      />

      {sorted.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geen wijzigingsaanvragen</CardTitle>
            <CardDescription>
              Start een wijziging via Mijn profiel of Organisatieprofiel. Afgesloten aanvragen verdwijnen uit dit
              overzicht.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <section className="flex min-w-0 flex-col gap-4">
          {sorted.map((r) => (
            <ProfileChangeRequestOverviewCard key={r.id} request={r} onOpen={openDetail} />
          ))}
        </section>
      )}
    </div>
  );
}
