import { useMemo } from "react";

import { deriveFormalOnboardingResumeStep } from "./derive-formal-onboarding-resume-step";
import { effectiveIncludedCertificationDraftIds } from "./onboarding-flow-helpers";
import { readOnboardingRegistrationCompletePayload } from "./lib/onboardingRegistrationCompleteSession";
import { useOnboardingFlowState } from "./onboarding-flow-provider";
import type { OnboardingStep } from "./onboarding-types";

export type ActiveFormalInquiryContinueBannerModel = {
  /**
   * In-progress formal dossier (past origin, inquiries in scope, registration not complete).
   * Use for header chrome such as the certification cart on **all** guest routes including `/welcome/formal-request`.
   */
  sessionActive: boolean;
  /**
   * “Continue aanvraag” banner above the outlet — same as `sessionActive` except hidden while already
   * on the formal onboarding URL prefix.
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
    const formalRegistrationStarted = flowState.requestOrigin !== "";
    const onFormalRoute = input.pathname.startsWith(input.formalOnboardingPathPrefix);

    const sessionActive =
      registrationCompletePayload == null &&
      includedCount > 0 &&
      formalRegistrationStarted;

    const visible = sessionActive && !onFormalRoute;

    const resumeStep = deriveFormalOnboardingResumeStep(flowState, resolvedContext);

    return { sessionActive, visible, includedCount, resumeStep };
  }, [flowState, resolvedContext, input.pathname, input.formalOnboardingPathPrefix]);
}
