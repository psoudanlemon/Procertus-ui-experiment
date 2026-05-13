import type { CertificationRequestDraft } from "../certification-request/types";
import { effectiveIncludedCertificationDraftIds } from "./onboarding-flow-helpers";
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

/**
 * Ordered steps for the guest formal-registration stepper and navigation (Verder / Terug).
 * Omits {@link innovationAttest} when no innovation-attest inquiry is in the submission package.
 */
export function registrationStepsSequence(
  drafts: readonly CertificationRequestDraft[],
  effectiveIncludedDraftIds: readonly string[],
): readonly OnboardingStep[] {
  if (registrationDraftsIncludeInnovationAttest(drafts, effectiveIncludedDraftIds)) {
    return [
      "origin",
      "customer",
      "company",
      "innovationAttest",
      "companyLegalEntities",
      "invoicing",
      "extras",
      "summary",
    ];
  }
  return [
    "origin",
    "customer",
    "company",
    "companyLegalEntities",
    "invoicing",
    "extras",
    "summary",
  ];
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
