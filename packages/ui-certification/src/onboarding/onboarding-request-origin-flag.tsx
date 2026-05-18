import { cn } from "@procertus-ui/ui";

import type { OnboardingRequestOrigin } from "./onboarding-request-origin";

function GlobeGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("text-muted-foreground", className)}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const frame = "shrink-0 overflow-hidden rounded-[3px] shadow-sm ring-1 ring-border/60";

function BeFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={cn(frame, className)} aria-hidden>
      <rect width="1" height="2" fill="#000000" x="0" />
      <rect width="1" height="2" fill="#FDDA24" x="1" />
      <rect width="1" height="2" fill="#EF3340" x="2" />
    </svg>
  );
}

function NlFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={cn(frame, className)} aria-hidden>
      <rect width="3" height="0.6667" y="0" fill="#AE1C28" />
      <rect width="3" height="0.6666" y="0.6667" fill="#FFFFFF" />
      <rect width="3" height="0.6667" y="1.3333" fill="#21468B" />
    </svg>
  );
}

/** EU circle of stars — simplified as dots for clarity at small size. */
function EuFlag({ className }: { className?: string }) {
  const r = 22;
  const cx = 30;
  const cy = 30;
  return (
    <svg viewBox="0 0 60 60" className={cn(frame, className)} aria-hidden>
      <rect width="60" height="60" fill="#003399" rx="3" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={2.6}
            fill="#FFCC00"
          />
        );
      })}
    </svg>
  );
}

export function RequestOriginFlag({
  origin,
  className,
  /** Fits {@link ChoiceCard} `leading`: overrides parent `[&_svg]:size-5`. */
  compact = false,
}: {
  origin: OnboardingRequestOrigin;
  className?: string;
  compact?: boolean;
}) {
  const heroBeNl = "h-6 w-9";
  const heroEu = "h-6 w-6";
  const leadBeNl = "!h-5 !w-[2.1rem]";
  const leadEu = "!h-5 !w-5";

  switch (origin) {
    case "be":
      return <BeFlag className={cn(compact ? leadBeNl : heroBeNl, className)} />;
    case "nl":
      return <NlFlag className={cn(compact ? leadBeNl : heroBeNl, className)} />;
    case "eu":
      return <EuFlag className={cn(compact ? leadEu : heroEu, className)} />;
    case "other":
      return (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[3px] bg-muted/40 ring-1 ring-border/60",
            compact ? "size-5" : "size-6",
            className,
          )}
          aria-hidden
        >
          <GlobeGlyph className={cn(compact ? "!h-3.5 !w-3.5" : "size-4 !h-4 !w-4")} />
        </span>
      );
  }
}
