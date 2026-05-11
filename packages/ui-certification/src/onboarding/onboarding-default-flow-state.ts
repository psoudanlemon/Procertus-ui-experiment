import { DEFAULT_VAT_PROTOTYPE_PRESET_ID } from "./lib/vatPrototypePresets";
import type { OnboardingFlowState } from "./onboarding-types";
import { DEFAULT_CONTEXT } from "./onboarding-flow-helpers";

export const DEFAULT_ONBOARDING_FLOW_STATE: OnboardingFlowState = {
  step: "origin",
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
  const storedStep = stored.step as OnboardingFlowState["step"] | "request";
  const step = storedStep === "request" ? "origin" : (storedStep as OnboardingFlowState["step"]);
  return {
    ...DEFAULT_ONBOARDING_FLOW_STATE,
    ...stored,
    step,
    context: { ...DEFAULT_CONTEXT, ...stored.context },
    companyFieldHints: stored.companyFieldHints ?? {},
    summaryKlantenportaalByPersonId: stored.summaryKlantenportaalByPersonId ?? {},
  };
}
