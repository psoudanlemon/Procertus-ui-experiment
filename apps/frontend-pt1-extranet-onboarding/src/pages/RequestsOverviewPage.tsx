import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardList,
} from "@procertus-ui/ui";
import { CertificationRequestCard } from "@procertus-ui/ui-certification";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { openPanel } = useAppPanels();
  const [requests] = useAuthenticatedRequests();

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-auto px-4 py-6 max-w-[1600px]">
      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-proc-xs md:flex-row md:items-start md:justify-between max-w-3xl">
        <div className="max-w-2xl">
          <Badge variant="secondary">Aangemelde omgeving</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Aanvragen</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Concepten en ingestuurde aanvragen blijven zichtbaar in dit overzicht. Start een nieuwe
            aanvraag of open een bestaande request voor detail en bewerking.
          </p>
        </div>
        <Button type="button" onClick={() => navigate("/requests/create")}>
          Nieuwe aanvraag
        </Button>
      </div>

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
                Start een nieuwe aanvraag om productcertificaties of attesten toe te voegen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" onClick={() => navigate("/requests/create")}>
                Nieuwe aanvraag
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
