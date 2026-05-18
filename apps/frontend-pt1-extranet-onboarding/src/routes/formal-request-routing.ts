import type { CertificationRequestDraft, OnboardingStep } from "@procertus-ui/ui-certification";
import { ONBOARDING_STEPS, registrationStepIndex } from "@procertus-ui/ui-certification";

/** Base path for anonymous formal registration; `:stepId` is required for the step view. */
export const FORMAL_ONBOARDING_PATH = "/welcome/formal-request";

export function formalOnboardingStepPath(step: OnboardingStep): string {
  return `${FORMAL_ONBOARDING_PATH}/${step}`;
}

export function parseFormalOnboardingStepParam(param: string | undefined): OnboardingStep | null {
  if (param == null || param === "") return null;
  const s = param as OnboardingStep;
  if (!ONBOARDING_STEPS.includes(s)) return null;
  return s;
}

/** If the URL names a step ahead of the resume step, redirect to resume. */
export function shouldClampFormalStepToResume(
  requested: OnboardingStep,
  resume: OnboardingStep,
  drafts: readonly CertificationRequestDraft[],
): boolean {
  const rq = registrationStepIndex(requested, drafts);
  const rr = registrationStepIndex(resume, drafts);
  return rq < 0 || rq > rr;
}
