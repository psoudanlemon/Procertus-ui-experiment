import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardList, H1, PageHeader } from "@procertus-ui/ui";
import { CertificationRequestCard } from "@procertus-ui/ui-certification";

import {
  requestStatus,
  useAuthenticatedRequests,
} from "../features/requests/authenticatedRequestStore";
import { REQUEST_DETAIL_PANEL_TYPE, useAppPanels } from "../panels";

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("nl-BE", {
        day: "numeric",
        month: "short",
      }).format(new Date(value))
    : undefined;

export function RequestsOverviewPage() {
  const { openPanel } = useAppPanels();
  const [requests] = useAuthenticatedRequests();

  return (
    <div className="flex w-full max-w-7xl flex-col gap-region px-4 py-6 text-left md:px-6 md:py-8">
      <PageHeader
        kicker="Aangemelde omgeving"
        title={<H1>Aanvragen</H1>}
        description="Concepten en ingestuurde aanvragen blijven zichtbaar in dit overzicht. Open een bestaande request voor detail."
      />

      <section className="min-w-0 space-y-4">
        {requests.length > 0 ? (
          <CardList items={requests}>
            {(request) => (
              <CertificationRequestCard
                key={request.id}
                inquiries={request.inquiries}
                lifecycleDateLabels={{
                  draft: formatDate(request.createdAt) ?? "Onbekend",
                  submitted: formatDate(request.submittedAt),
                  "in-progress":
                    request.status === "in-progress" ||
                    request.status === "approved" ||
                    request.status === "archived" ||
                    request.status === "rejected"
                      ? formatDate(request.updatedAt)
                      : undefined,
                  approved: formatDate(request.resolvedAt),
                }}
                requestId={request.id}
                status={request.status}
                statusLabel={requestStatus(request)}
                statusVariant={request.status === "draft" ? "outline" : "secondary"}
                onOpen={(requestId) => openPanel(REQUEST_DETAIL_PANEL_TYPE, { requestId })}
              />
            )}
          </CardList>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nog geen aanvragen</CardTitle>
              <CardDescription>
                Aanvragen die je via de wegwijzer opstart, verschijnen hier.
              </CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        )}
      </section>
    </div>
  );
}
