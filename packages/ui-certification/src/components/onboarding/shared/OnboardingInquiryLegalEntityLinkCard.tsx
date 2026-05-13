import type { ReactNode } from "react";

export type OnboardingInquiryLegalEntityLinkCardProps = {
  leftColumnLabel: string;
  rightColumnLabel: string;
  left: ReactNode;
  right: ReactNode;
};

/**
 * Aanvraag ↔ rechts‑persoon: zelfde kaartstructuur op certificatie‑ en facturatiestap
 * (kopregels in kapjes, scheidingslijn, twee kolommen inhoud).
 */
export function OnboardingInquiryLegalEntityLinkCard({
  leftColumnLabel,
  rightColumnLabel,
  left,
  right,
}: OnboardingInquiryLegalEntityLinkCardProps) {
  return (
    <li className="list-none rounded-lg border border-border bg-card px-4 py-3">
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {leftColumnLabel}
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {rightColumnLabel}
        </p>
        <div className="col-span-full border-b border-border" />
        <div className="min-w-0">{left}</div>
        <div className="min-w-0">{right}</div>
      </div>
    </li>
  );
}

export type OnboardingLegalEntityLinkSummaryTextProps = {
  primary: string;
  secondary?: string | null;
};

/** Standaard typografie rechtskolom: organisatie/vestiging vet, detailregel gedempt. */
export function OnboardingLegalEntityLinkSummaryText({
  primary,
  secondary,
}: OnboardingLegalEntityLinkSummaryTextProps) {
  return (
    <div className="text-sm text-foreground">
      <p className="font-semibold leading-snug">{primary}</p>
      {secondary ? (
        <p className="mt-1 text-xs leading-snug text-muted-foreground">{secondary}</p>
      ) : null}
    </div>
  );
}
