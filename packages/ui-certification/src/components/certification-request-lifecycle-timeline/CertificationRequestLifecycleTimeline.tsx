import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
  cn,
} from "@procertus-ui/ui";

export type CertificationRequestLifecycleStatus =
  | "draft"
  | "submitted"
  | "in-progress"
  | "approved"
  | "archived"
  | "rejected"
  | "cancelled";

export type CertificationRequestLifecycleStepId =
  | "draft"
  | "submitted"
  | "in-progress"
  | "approved"
  | "rejected"
  | "cancelled";

export type CertificationRequestLifecycleTimelineProps = {
  className?: string;
  dateLabels?: Partial<Record<CertificationRequestLifecycleStepId, string>>;
  status: CertificationRequestLifecycleStatus;
};

export type CertificationRequestLifecycleEvent = {
  id: string;
  actorLabel: string;
  description?: string;
  occurredAtLabel: string;
  status?: "default" | "destructive" | "success";
  title: string;
};

export type CertificationRequestLifecycleDetailTimelineProps = {
  className?: string;
  events: readonly CertificationRequestLifecycleEvent[];
};

const happyPathLifecycle: CertificationRequestLifecycleStepId[] = [
  "draft",
  "submitted",
  "in-progress",
  "approved",
];

const activeLifecycleStepByStatus: Record<
  CertificationRequestLifecycleStatus,
  CertificationRequestLifecycleStepId
> = {
  draft: "draft",
  submitted: "submitted",
  "in-progress": "in-progress",
  approved: "approved",
  archived: "approved",
  rejected: "rejected",
  cancelled: "cancelled",
};

const lifecycleLabels: Record<CertificationRequestLifecycleStepId, string> = {
  draft: "Aangemaakt",
  submitted: "Ingediend",
  "in-progress": "In behandeling",
  approved: "Goedgekeurd",
  rejected: "Geweigerd",
  cancelled: "Geannuleerd",
};

const visibleLifecycleForStatus = (status: CertificationRequestLifecycleStatus) => {
  if (status === "cancelled") {
    return ["draft", "submitted", "cancelled"] satisfies CertificationRequestLifecycleStepId[];
  }
  if (status === "rejected") {
    return [
      "draft",
      "submitted",
      "in-progress",
      "rejected",
    ] satisfies CertificationRequestLifecycleStepId[];
  }
  return happyPathLifecycle;
};

export function CertificationRequestLifecycleTimeline({
  className,
  dateLabels = {},
  status,
}: CertificationRequestLifecycleTimelineProps) {
  const visibleLifecycle = visibleLifecycleForStatus(status);
  const activeStepId = activeLifecycleStepByStatus[status];
  const activeIndex = visibleLifecycle.indexOf(activeStepId);
  const destructive = status === "cancelled" || status === "rejected";

  return (
    <Timeline
      value={activeIndex + 1}
      orientation="horizontal"
      className={cn("w-full", className)}
      aria-label="Aanvraaglevenscyclus"
    >
      {visibleLifecycle.map((step, index) => {
        const completedOrActive = index <= activeIndex;
        const current = index === activeIndex;
        return (
          <TimelineItem
            key={step}
            step={index + 1}
            className={cn("gap-1 pe-2 not-last:pe-4", !completedOrActive && "opacity-45")}
          >
            <TimelineIndicator
              className={cn(
                "bg-card",
                completedOrActive && "border-primary bg-primary/10",
                current && "bg-primary",
                destructive && current && "border-destructive! bg-destructive-foreground",
                destructive && current && completedOrActive && "border-destructive-foreground",
              )}
            />
            <TimelineSeparator
              className={cn(
                completedOrActive ? "bg-primary" : undefined,
                destructive && index <= activeIndex && "bg-destructive",
              )}
            />
            <TimelineHeader>
              <TimelineTitle
                className={cn(
                  "text-xs leading-tight text-foreground",
                  !completedOrActive && "text-muted-foreground",
                  current && "text-foreground",
                  destructive && current && "text-destructive-foreground",
                )}
              >
                {lifecycleLabels[step]}
              </TimelineTitle>
              {dateLabels[step] ? (
                <TimelineDate className="mb-0 mt-0.5 text-[10px] font-normal leading-tight text-muted-foreground/70">
                  {dateLabels[step]}
                </TimelineDate>
              ) : null}
            </TimelineHeader>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}

export function CertificationRequestLifecycleDetailTimeline({
  className,
  events,
}: CertificationRequestLifecycleDetailTimelineProps) {
  return (
    <Timeline
      value={events.length}
      orientation="vertical"
      className={cn("w-full", className)}
      aria-label="Gedetailleerde aanvraaglevenscyclus"
    >
      {events.map((event, index) => {
        const destructive = event.status === "destructive";
        const success = event.status === "success";
        return (
          <TimelineItem key={event.id} step={index + 1} className="pb-section">
            <TimelineHeader className="min-w-0">
              <TimelineTitle
                className={cn(
                  "text-sm font-semibold leading-tight text-foreground",
                  destructive && "text-destructive-foreground",
                  success && "text-success",
                )}
              >
                {event.title}
              </TimelineTitle>
              <TimelineDate className="mb-0 mt-micro text-xs font-normal leading-tight text-muted-foreground">
                {event.occurredAtLabel} door {event.actorLabel}
              </TimelineDate>
            </TimelineHeader>
            <TimelineIndicator
              className={cn(
                "bg-primary",
                destructive && "border-destructive! bg-destructive!",
                success && "border-success! bg-success!",
              )}
            />
            <TimelineSeparator
              className={cn(destructive && "bg-destructive/60", success && "bg-success/60")}
            />
            {event.description ? (
              <p className="text-sm leading-normal text-muted-foreground">{event.description}</p>
            ) : null}
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
