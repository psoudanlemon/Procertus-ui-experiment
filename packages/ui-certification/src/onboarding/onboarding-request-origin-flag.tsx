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

const frame = "shrink-0 overflow-hidden";

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

/**
 * EU vlag op de officiële 3:2 ratio (zoals BE/NL). Stars als dots: cirkel-straal
 * = hoogte/3, dot-radius ≈ hoogte/18 — volgt de officiële spec voor de
 * twaalf-sterren cirkel centraal op de blauwe vlag.
 */
function EuFlag({ className }: { className?: string }) {
  const r = 20;
  const cx = 45;
  const cy = 30;
  return (
    <svg viewBox="0 0 90 60" className={cn(frame, className)} aria-hidden>
      <rect width="90" height="60" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={3.3}
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
  // Identieke afmetingen voor alle vier origin-glyphs (vlaggen + globe) zodat
  // ze in lijst-layouts en als `leading`-icoon strak uitlijnen. Hero gebruikt
  // standaard tokens (h-6 × w-9); compact gebruikt een exacte 38.85px hoogte
  // om gelijk te lopen met de gecombineerde titel + description-hoogte in de
  // ChoiceCard. Zie off-token-log.md — bewuste exception.
  const heroSize = "h-6 w-9";
  const leadSize = "h-[38.85px]! w-16!";

  switch (origin) {
    case "be":
      return <BeFlag className={cn(compact ? leadSize : heroSize, className)} />;
    case "nl":
      return <NlFlag className={cn(compact ? leadSize : heroSize, className)} />;
    case "eu":
      return <EuFlag className={cn(compact ? leadSize : heroSize, className)} />;
    case "other":
      return (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center bg-muted/40",
            compact ? "h-[38.85px]! w-16!" : "h-6 w-9",
            className,
          )}
          aria-hidden
        >
          <GlobeGlyph className={cn(compact ? "size-6!" : "size-4!")} />
        </span>
      );
  }
}
