import type { OnboardingFlowState } from "../onboarding-types";
import type { OnboardingFlowPersistencePort } from "./onboarding-flow-persistence-port";

export function createLocalStorageOnboardingFlowPersistence(options: {
  storageKey: string;
}): OnboardingFlowPersistencePort {
  const { storageKey } = options;
  return {
    storageKey,
    load() {
      if (typeof localStorage === "undefined") return null;
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? (JSON.parse(raw) as OnboardingFlowState) : null;
      } catch {
        return null;
      }
    },
    save(state: OnboardingFlowState) {
      if (typeof localStorage === "undefined") return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        /** ignore quota / privacy mode */
      }
    },
  };
}
