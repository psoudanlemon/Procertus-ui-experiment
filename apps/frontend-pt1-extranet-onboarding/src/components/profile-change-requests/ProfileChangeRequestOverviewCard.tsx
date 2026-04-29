import type { KeyboardEvent } from "react";
import {
  Badge,
  Card,
  cn,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@procertus-ui/ui";
import { CertificationRequestLifecycleTimeline } from "@procertus-ui/ui-certification";
import { useMemo } from "react";

import { diffStringRecords } from "../../features/profile-change-requests/flatten";
import { labelForChangeField } from "../../features/profile-change-requests/field-labels";
import {
  PROFILE_CHANGE_STATUS_LABEL,
  profileChangeStatusToCertificationTimeline,
} from "../../features/profile-change-requests/lifecycle-map";
import { profileChangeTimelineDateLabels } from "../../features/profile-change-requests/profile-change-timeline-labels";
import type { ProfileChangeRequest } from "../../features/profile-change-requests/types";

export type ProfileChangeRequestOverviewCardProps = {
  className?: string;
  request: ProfileChangeRequest;
  onOpen: (requestId: string) => void;
};

function DigestSummary({ request }: { request: ProfileChangeRequest }) {
  const rows = useMemo(
    () => diffStringRecords(request.baseline as Record<string, string>, request.proposed as Record<string, string>),
    [request.baseline, request.proposed],
  );
  const preview = rows.slice(0, 3);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {rows.length === 1 ? "1 veld gewijzigd" : `${rows.length} velden gewijzigd`}
      </p>
      <ItemGroup className="w-full gap-2">
        {preview.map((row) => (
          <Item
            key={row.key}
            role="listitem"
            variant="outline"
            size="sm"
            className="min-w-0 border-border/70 bg-muted/25 shadow-proc-xs"
          >
            <ItemContent>
              <ItemTitle className="line-clamp-2 font-semibold">{labelForChangeField(row.key)}</ItemTitle>
              <ItemDescription className="line-clamp-2 text-xs">
                <span className="text-muted-foreground">Was: </span>
                <span>{row.before || "—"}</span>
                <span className="text-muted-foreground"> → </span>
                <span className="font-medium text-foreground">{row.after || "—"}</span>
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
      {rows.length > 3 ? (
        <p className="text-xs text-muted-foreground">
          +{rows.length - 3} extra wijzigingen. Open de kaart voor alle details.
        </p>
      ) : null}
    </div>
  );
}

export function ProfileChangeRequestOverviewCard({
  className,
  request,
  onOpen,
}: ProfileChangeRequestOverviewCardProps) {
  const timelineStatus = profileChangeStatusToCertificationTimeline(request.status);
  const dateLabels = useMemo(() => profileChangeTimelineDateLabels(request), [request]);

  const interactiveProps = {
    role: "button" as const,
    tabIndex: 0,
    onClick: () => onOpen(request.id),
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen(request.id);
      }
    },
  };

  return (
    <Card
      className={cn(
        "h-full overflow-visible p-4 transition-colors",
        "cursor-pointer hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...interactiveProps}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-snug">{request.title}</span>
          <Badge variant="secondary" className="shrink-0">
            {PROFILE_CHANGE_STATUS_LABEL[request.status]}
          </Badge>
        </div>

        <div className="pt-region">
          <CertificationRequestLifecycleTimeline dateLabels={dateLabels} status={timelineStatus} />
        </div>

        <DigestSummary request={request} />

        <p className="text-xs text-muted-foreground">Open voor details, tijdlijn en conversatie.</p>
      </div>
    </Card>
  );
}
