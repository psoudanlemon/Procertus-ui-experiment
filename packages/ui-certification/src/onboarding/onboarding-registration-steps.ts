import type { CertificationRequestDraft } from "../certification-request/types";
import { effectiveIncludedCertificationDraftIds } from "./onboarding-flow-helpers";
import { productBoundCertificationDedupKey } from "./lib/product-bound-certification-inquiry";
import type { OnboardingFlowState, OnboardingStep } from "./onboarding-types";

export function registrationDraftsIncludeInnovationAttest(
  drafts: readonly CertificationRequestDraft[],
  effectiveIncludedDraftIds: readonly string[],
): boolean {
  const allow = new Set(effectiveIncludedDraftIds);
  return drafts.some((d) => allow.has(d.id) && d.entryId === "innovation-attest");
}

export function registrationDraftsIncludeInnovationAttestForFlowState(
  flowState: Pick<OnboardingFlowState, "drafts" | "summaryIncludedDraftIds">,
): boolean {
  const ids = effectiveIncludedCertificationDraftIds(flowState.drafts, flowState.summaryIncludedDraftIds);
  return registrationDraftsIncludeInnovationAttest(flowState.drafts, ids);
}

/** True when the dossier includes at least one product-bound inquiry with a resolvable product key. */
export function registrationDraftsIncludeProductBoundCertification(
  drafts: readonly CertificationRequestDraft[],
  effectiveIncludedDraftIds: readonly string[],
): boolean {
  const allow = new Set(effectiveIncludedDraftIds);
  return drafts.some((d) => allow.has(d.id) && productBoundCertificationDedupKey(d) !== null);
}

export function registrationDraftsIncludeProductBoundCertificationForFlowState(
  flowState: Pick<OnboardingFlowState, "drafts" | "summaryIncludedDraftIds">,
): boolean {
  const ids = effectiveIncludedCertificationDraftIds(flowState.drafts, flowState.summaryIncludedDraftIds);
  return registrationDraftsIncludeProductBoundCertification(flowState.drafts, ids);
}

/**
 * Ordered steps for the guest formal-registration stepper and navigation (Verder / Terug).
 * Omits {@link innovationAttest} when no innovation-attest inquiry is in the submission package.
 * Omits {@link companyLegalEntities} when there is no product-bound certification inquiry in the package.
 */
export function registrationStepsSequence(
  drafts: readonly CertificationRequestDraft[],
  effectiveIncludedDraftIds: readonly string[],
): readonly OnboardingStep[] {
  const needsLegalEntities = registrationDraftsIncludeProductBoundCertification(
    drafts,
    effectiveIncludedDraftIds,
  );

  if (registrationDraftsIncludeInnovationAttest(drafts, effectiveIncludedDraftIds)) {
    const core: OnboardingStep[] = [
      "origin",
      "customer",
      "company",
      "innovationAttest",
      ...(needsLegalEntities ? (["companyLegalEntities"] as const) : []),
      "invoicing",
      "extras",
      "summary",
    ];
    return core;
  }
  const core: OnboardingStep[] = [
    "origin",
    "customer",
    "company",
    ...(needsLegalEntities ? (["companyLegalEntities"] as const) : []),
    "invoicing",
    "extras",
    "summary",
  ];
  return core;
}

export function registrationStepsSequenceForFlowState(
  flowState: Pick<OnboardingFlowState, "drafts" | "summaryIncludedDraftIds">,
): readonly OnboardingStep[] {
  const ids = effectiveIncludedCertificationDraftIds(flowState.drafts, flowState.summaryIncludedDraftIds);
  return registrationStepsSequence(flowState.drafts, ids);
}

export function registrationStepIndex(
  step: OnboardingStep,
  drafts: readonly CertificationRequestDraft[],
  effectiveIncludedDraftIds: readonly string[],
): number {
  return registrationStepsSequence(drafts, effectiveIncludedDraftIds).indexOf(step);
}
