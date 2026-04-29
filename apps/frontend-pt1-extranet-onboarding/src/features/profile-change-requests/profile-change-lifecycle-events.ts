import type { CertificationRequestLifecycleEvent } from "@procertus-ui/ui-certification";

import type { ProfileChangeRequest } from "./types";

const formatWhen = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export function profileChangeDetailLifecycleEvents(request: ProfileChangeRequest): CertificationRequestLifecycleEvent[] {
  const events: CertificationRequestLifecycleEvent[] = [
    {
      id: "submitted",
      title: "Wijzigingsdocument ingediend",
      actorLabel: "Aanvrager",
      occurredAtLabel: formatWhen(request.createdAt),
      description: `${request.kind === "user" ? "Gebruikersprofiel" : "Organisatieprofiel"} — in behandeling bij PROCERTUS.`,
    },
  ];

  if (request.status === "validated") {
    events.push({
      id: "validated",
      title: "Gevalideerd door verwerker",
      actorLabel: "Verwerker",
      occurredAtLabel: formatWhen(request.updatedAt),
      description: "Klaar voor definitieve acceptatie en doorvoer.",
      status: "success",
    });
  }

  return events;
}
