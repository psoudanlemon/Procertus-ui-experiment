import { DEFAULT_VAT_PROTOTYPE_PRESET_ID } from "./lib/vatPrototypePresets";
import type { OnboardingFlowState } from "./onboarding-types";
import { DEFAULT_CONTEXT } from "./onboarding-flow-helpers";

export const DEFAULT_ONBOARDING_FLOW_STATE: OnboardingFlowState = {
  trajectServiceId: "",
  requestOrigin: "",
  drafts: [],
  summaryIncludedDraftIds: [],
  context: DEFAULT_CONTEXT,
  prototypeVatPresetId: DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  companyFieldHints: {},
  summaryKlantenportaalByPersonId: {},
};

export function hydrateOnboardingFlowStateFromStored(
  stored: OnboardingFlowState | null | undefined,
): OnboardingFlowState {
  if (!stored) return DEFAULT_ONBOARDING_FLOW_STATE;
  const { step: _legacyStep, registrationEntryLabel: rawEntryLabel, ...restStored } = stored as OnboardingFlowState & {
    step?: unknown;
  };
  const trimmedLabel = rawEntryLabel?.trim();
  return {
    ...DEFAULT_ONBOARDING_FLOW_STATE,
    ...restStored,
    ...(trimmedLabel ? { registrationEntryLabel: trimmedLabel } : {}),
    context: { ...DEFAULT_CONTEXT, ...stored.context },
    companyFieldHints: stored.companyFieldHints ?? {},
    summaryKlantenportaalByPersonId: stored.summaryKlantenportaalByPersonId ?? {},
  };
}
