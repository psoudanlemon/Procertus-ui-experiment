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

import type { WizardStepperModel } from "./certification-request-wizard-types";

export function CompactWizardTimeline({ model }: { model: WizardStepperModel }) {
  return (
    <Timeline
      value={model.activeStep + 1}
      orientation="horizontal"
      className="w-full"
      aria-label="Aanvraagstappen"
    >
      {model.steps.map((step, index) => {
        const completedOrActive = index <= model.activeStep;
        const current = index === model.activeStep;
        const available = step.available !== false;
        return (
          <TimelineItem
            key={step.id}
            step={index + 1}
            className={cn("gap-1 pe-2 not-last:pe-4", !completedOrActive && "opacity-50")}
          >
            <TimelineIndicator
              className={cn(
                "bg-card",
                completedOrActive && "border-primary bg-primary/10",
                current && "bg-primary",
              )}
            />
            <TimelineSeparator className={completedOrActive ? "bg-primary" : undefined} />
            <TimelineHeader>
              <button
                type="button"
                className={cn(
                  "text-left text-xs font-medium leading-tight text-muted-foreground",
                  current && "text-foreground",
                  available && "hover:text-foreground",
                  !available && "cursor-default opacity-60",
                )}
                disabled={!available}
                onClick={() => model.onStepChange(index)}
              >
                <TimelineTitle className="text-inherit">{step.title}</TimelineTitle>
                {step.description ? (
                  <TimelineDate className="mb-0 mt-0.5 text-[10px] font-normal leading-tight text-muted-foreground/70">
                    {step.description}
                  </TimelineDate>
                ) : null}
              </button>
            </TimelineHeader>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
