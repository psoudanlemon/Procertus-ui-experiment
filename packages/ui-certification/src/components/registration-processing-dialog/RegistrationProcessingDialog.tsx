import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Progress,
  cn,
} from "@procertus-ui/ui";

export type RegistrationProcessingStep = {
  id: string;
  label: string;
};

export type RegistrationProcessingDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Progress bar value 0–100. */
  progress: number;
  /**
   * Index of the step currently highlighted in the checklist, or `-1` before the
   * simulation has advanced (all dots muted).
   */
  activeStepIndex: number;
  steps: readonly RegistrationProcessingStep[];
  /** Passed to `DialogContent`. */
  contentClassName?: string;
  /** Dialog heading (default: Dutch onboarding copy). */
  title?: ReactNode;
  /** Intro under the title. */
  description?: ReactNode;
  /** Bold line above the prototype paragraph in the status panel. */
  statusTitle?: ReactNode;
  /** Supporting copy in the status panel. */
  statusBody?: ReactNode;
  /** Label next to the percentage (default: “Voortgang”). */
  progressLabel?: ReactNode;
  /** `aria-label` on the progress bar. */
  progressAriaLabel?: string;
};

const defaultTitle = "Registratie verwerken";
const defaultDescription =
  "Even geduld: we slaan uw gegevens en aanvragen op en bereiden uw account voor (demo).";
const defaultStatusTitle = "Registratie wordt voltooid";
const defaultStatusBody =
  "Prototype: we simuleren het aanmaken van uw account, het opslaan van uw gegevens en het koppelen van uw aanvragen.";
const defaultProgressLabel = "Voortgang";
const defaultProgressAriaLabel = "Voortgang registratie";

/**
 * Modal shown while a **mock or real** registration completes: spinner, progress bar, and a
 * checklist of phases. Presentational only — parent owns timers, routing, and step labels.
 */
export function RegistrationProcessingDialog({
  open,
  onOpenChange,
  progress,
  activeStepIndex,
  steps,
  contentClassName,
  title = defaultTitle,
  description = defaultDescription,
  statusTitle = defaultStatusTitle,
  statusBody = defaultStatusBody,
  progressLabel = defaultProgressLabel,
  progressAriaLabel = defaultProgressAriaLabel,
}: RegistrationProcessingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn("max-w-lg gap-section sm:max-w-lg", contentClassName)}
      >
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-pretty">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-component rounded-lg border border-border bg-muted/30 p-section">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="mt-0.5 size-8 shrink-0 animate-spin [animation-duration:3s] [animation-timing-function:linear] text-primary"
            strokeWidth={1.75}
            aria-hidden
          />
          <div className="min-w-0 text-left text-sm leading-relaxed text-muted-foreground">
            <p className="m-0 font-medium text-foreground">{statusTitle}</p>
            <p className="mt-micro m-0">{statusBody}</p>
          </div>
        </div>
        <div className="space-y-component">
          <div className="flex items-center justify-between gap-component text-sm">
            <span className="font-medium text-foreground">{progressLabel}</span>
            <span className="tabular-nums text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" aria-label={progressAriaLabel} />
        </div>
        <ul
          className="max-h-[min(40vh,16rem)] space-y-component overflow-y-auto pr-1 text-left"
          aria-live="polite"
        >
          {steps.map((item, index) => {
            const done = activeStepIndex > index;
            const active = activeStepIndex === index;
            return (
              <li
                key={item.id}
                className={cn(
                  "flex items-center gap-component text-sm transition-colors",
                  done || active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    done
                      ? "bg-primary"
                      : active
                        ? "animate-pulse bg-primary"
                        : "bg-muted-foreground/30",
                  )}
                  aria-hidden
                />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
