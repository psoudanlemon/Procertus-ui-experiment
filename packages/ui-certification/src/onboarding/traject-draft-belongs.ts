import type { CertificationRequestDraft } from "../certification-request/types";

/**
 * Bepaalt of een draft bij een wegwijzer-route (`serviceId`) hoort voor merge/filter.
 * Zelfde regels als de host-app variant; centraal zodat onboarding de pakketselectie kan zetten.
 */
export function draftBelongsToTrajectRoot(
  draft: CertificationRequestDraft,
  serviceId: string,
): boolean {
  const root = draft.trajectRootServiceId;
  if (root != null) return root === serviceId;
  if (!draft.productId?.trim()) {
    return draft.entryId === serviceId || draft.id.startsWith(`${serviceId}-`);
  }
  return draft.id === `${draft.productId}-${serviceId}`;
}

/** Alle draft-ids voor het huidige traject (of alle drafts als er geen `trajectServiceId` is). */
export function formalPackageSummaryDraftIds(
  drafts: readonly CertificationRequestDraft[],
  trajectServiceId: string,
): string[] {
  const sid = trajectServiceId.trim();
  if (!sid) return drafts.map((d) => d.id);
  return drafts.filter((d) => draftBelongsToTrajectRoot(d, sid)).map((d) => d.id);
}
