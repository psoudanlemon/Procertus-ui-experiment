import type { CertificationRequestDraft } from "../certification-request/types";
import { productBoundCertificationDedupKey } from "./lib/product-bound-certification-inquiry";
import type { OnboardingFlowState, OnboardingStep } from "./onboarding-types";

/**
 * Whether the **concept-aanvraag** (mandje / `drafts`) bevat een innovatie-attestregel.
 *
 * Gebruikt **alleen** `drafts`, niet {@link OnboardingFlowState.summaryIncludedDraftIds}:
 * een lege selection-array `[]` uit default state zou anders {@link effectiveIncludedCertificationDraftIds}
 * leeg maken en deze substappen onterecht uit de registratiereeks houden — terwijl de inquiry wél in het
 * dossier zit. De nazicht-toggles bepalen nog steeds wat meetelt voor indiening via
 * `effectiveIncludedCertificationDraftIds` elders.
 */
export function registrationDraftsIncludeInnovationAttest(
  drafts: readonly CertificationRequestDraft[],
): boolean {
  return drafts.some((d) => d.entryId === "innovation-attest");
}

export function registrationDraftsIncludeInnovationAttestForFlowState(
  flowState: Pick<OnboardingFlowState, "drafts">,
): boolean {
  return registrationDraftsIncludeInnovationAttest(flowState.drafts);
}

/** Zie {@link registrationDraftsIncludeInnovationAttest} — zelfde semantics voor metrologie. */
export function registrationDraftsIncludeMetrology(drafts: readonly CertificationRequestDraft[]): boolean {
  return drafts.some((d) => d.entryId === "metrology");
}

export function registrationDraftsIncludeMetrologyForFlowState(
  flowState: Pick<OnboardingFlowState, "drafts">,
): boolean {
  return registrationDraftsIncludeMetrology(flowState.drafts);
}

/** True when the dossier includes at least one product-bound inquiry with a resolvable product key. */
export function registrationDraftsIncludeProductBoundCertification(
  drafts: readonly CertificationRequestDraft[],
): boolean {
  return drafts.some((d) => productBoundCertificationDedupKey(d) !== null);
}

export function registrationDraftsIncludeProductBoundCertificationForFlowState(
  flowState: Pick<OnboardingFlowState, "drafts">,
): boolean {
  return registrationDraftsIncludeProductBoundCertification(flowState.drafts);
}

/**
 * Ordered steps for the guest formal-registration stepper and navigation (Verder / Terug).
 * Omits innovatie-/metrologie-stappen when het mandje geen bijbehorende inquiry bevat.
 * {@link companyLegalEntities} blijft voorlopig altijd in de reeks zichtbaar; de feedback
 * onder 3.8 vraagt om hem later volledig te verwijderen, maar tot dan willen we geen oversight.
 */
export function registrationStepsSequence(drafts: readonly CertificationRequestDraft[]): readonly OnboardingStep[] {
  const needsInnovationAttest = registrationDraftsIncludeInnovationAttest(drafts);
  const needsMetrology = registrationDraftsIncludeMetrology(drafts);

  const core: OnboardingStep[] = [
    "origin",
    "company",
    "customer",
    ...(needsInnovationAttest ? (["innovationAttest"] as const) : []),
    ...(needsMetrology ? (["metrologyAttest"] as const) : []),
    "companyLegalEntities",
    "invoicing",
    "extras",
    "summary",
  ];
  return core;
}

export function registrationStepsSequenceForFlowState(
  flowState: Pick<OnboardingFlowState, "drafts">,
): readonly OnboardingStep[] {
  return registrationStepsSequence(flowState.drafts);
}

export function registrationStepIndex(
  step: OnboardingStep,
  drafts: readonly CertificationRequestDraft[],
): number {
  return registrationStepsSequence(drafts).indexOf(step);
}
