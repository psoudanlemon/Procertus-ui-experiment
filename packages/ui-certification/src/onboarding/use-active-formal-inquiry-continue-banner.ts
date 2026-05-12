import { useMemo } from "react";

import { deriveFormalOnboardingResumeStep } from "./derive-formal-onboarding-resume-step";
import { effectiveIncludedCertificationDraftIds } from "./onboarding-flow-helpers";
import { readOnboardingRegistrationCompletePayload } from "./lib/onboardingRegistrationCompleteSession";
import { useOnboardingFlowState } from "./onboarding-flow-provider";
import type { OnboardingStep } from "./onboarding-types";

export type ActiveFormalInquiryContinueBannerModel = {
  /**
   * In-progress formal dossier past triage (“traject opstarten”) or after registratie‑origin,
   * met minstens één opgenomen certificatie‑concept. Gebruikt voor het mandje (ook op
   * `/welcome/formal-request`).
   */
  sessionActive: boolean;
  /**
   * “Continue aanvraag” boven de outlet — verborgen op het formele onboarding‑pad zelf.
   */
  visible: boolean;
  includedCount: number;
  resumeStep: OnboardingStep;
};

/**
 * Host passes URL routing details (no react-router dependency here). Derives both banner visibility
 * (hidden on the formal route) and broader `sessionActive` for chrome that should stay visible during formal onboarding.
 */
export function useActiveFormalInquiryContinueBanner(input: {
  pathname: string;
  formalOnboardingPathPrefix: string;
}): ActiveFormalInquiryContinueBannerModel {
  const { flowState, resolvedContext } = useOnboardingFlowState();

  return useMemo((): ActiveFormalInquiryContinueBannerModel => {
    const registrationCompletePayload = readOnboardingRegistrationCompletePayload();
    const includedCount = effectiveIncludedCertificationDraftIds(
      flowState.drafts,
      flowState.summaryIncludedDraftIds,
    ).length;
    const formalDossierContextStarted =
      flowState.formalRequestPackageCommitted || flowState.requestOrigin !== "";
    const onFormalRoute = input.pathname.startsWith(input.formalOnboardingPathPrefix);

    const sessionActive =
      registrationCompletePayload == null &&
      includedCount > 0 &&
      formalDossierContextStarted;

    const visible = sessionActive && !onFormalRoute;

    const resumeStep = deriveFormalOnboardingResumeStep(flowState, resolvedContext);

    return { sessionActive, visible, includedCount, resumeStep };
  }, [flowState, resolvedContext, input.pathname, input.formalOnboardingPathPrefix]);
}
