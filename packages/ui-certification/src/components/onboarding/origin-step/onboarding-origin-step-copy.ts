export type OnboardingOriginStepCopy = {
  choiceGroupLegend: string;
  choiceGroupHint: string;
};

export const DEFAULT_ONBOARDING_ORIGIN_STEP_COPY: OnboardingOriginStepCopy = {
  choiceGroupLegend: "Waar is uw organisatie gevestigd?",
  choiceGroupHint: "Uw keuze bepaalt welke gegevens we in de volgende stappen vragen en tonen.",
};

export function mergeOnboardingOriginCopy(
  overrides?: Partial<OnboardingOriginStepCopy>,
): OnboardingOriginStepCopy {
  return { ...DEFAULT_ONBOARDING_ORIGIN_STEP_COPY, ...overrides };
}
