import type { OnboardingFlowState } from "../onboarding-types";
import type { OnboardingFlowPersistencePort } from "./onboarding-flow-persistence-port";

export type MemoryOnboardingPersistenceOptions = {
  /** Initial snapshot; reads/writes mutate this reference. */
  snapshot?: OnboardingFlowState | null;
};

export function createMemoryOnboardingFlowPersistence(
  options?: MemoryOnboardingPersistenceOptions,
): OnboardingFlowPersistencePort {
  let value = options?.snapshot ?? null;
  return {
    storageKey: "memory:onboarding-flow",
    load() {
      return value;
    },
    save(state: OnboardingFlowState) {
      value = state;
    },
  };
}
