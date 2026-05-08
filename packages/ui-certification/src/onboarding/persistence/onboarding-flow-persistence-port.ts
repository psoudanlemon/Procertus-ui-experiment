import type { OnboardingFlowState } from "../onboarding-types";

/** Load/save port for onboarding flow persistence (localStorage, memory, HTTP, …). */
export interface OnboardingFlowPersistencePort {
  readonly storageKey?: string;
  /** `null` when absent or unreadable; sync API matches existing wizard behaviour. */
  load(): OnboardingFlowState | null;
  save(state: OnboardingFlowState): void;
}
