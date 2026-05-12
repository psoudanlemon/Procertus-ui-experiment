import { DEFAULT_VAT_PROTOTYPE_PRESET_ID } from "./lib/vatPrototypePresets";
import type { OnboardingFlowState } from "./onboarding-types";
import { GUEST_INTAKE_CHANNELS, type GuestIntakeChannel } from "./onboarding-types";
import { DEFAULT_CONTEXT } from "./onboarding-flow-helpers";

function coerceGuestIntakeChannel(raw: unknown): GuestIntakeChannel {
  return typeof raw === "string" && (GUEST_INTAKE_CHANNELS as readonly string[]).includes(raw)
    ? (raw as GuestIntakeChannel)
    : "";
}

export const DEFAULT_ONBOARDING_FLOW_STATE: OnboardingFlowState = {
  trajectServiceId: "",
  guestIntakeChannel: "",
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
  const rawDrafts = restStored.drafts ?? [];
  const backfillTrajectRoot = (restStored.trajectServiceId ?? "").trim();
  const productDrafts = rawDrafts.filter((d) => Boolean(d.productId?.trim()));
  const allProductRootsMissing =
    productDrafts.length > 0 &&
    productDrafts.every((d) => (d as { trajectRootServiceId?: string }).trajectRootServiceId == null);
  const migratedDrafts =
    allProductRootsMissing && backfillTrajectRoot
      ? rawDrafts.map((d) =>
          d.productId?.trim() && (d as { trajectRootServiceId?: string }).trajectRootServiceId == null
            ? { ...d, trajectRootServiceId: backfillTrajectRoot }
            : d,
        )
      : rawDrafts;

  return {
    ...DEFAULT_ONBOARDING_FLOW_STATE,
    ...restStored,
    drafts: migratedDrafts,
    guestIntakeChannel: coerceGuestIntakeChannel(stored.guestIntakeChannel),
    ...(trimmedLabel ? { registrationEntryLabel: trimmedLabel } : {}),
    context: { ...DEFAULT_CONTEXT, ...stored.context },
    companyFieldHints: stored.companyFieldHints ?? {},
    summaryKlantenportaalByPersonId: stored.summaryKlantenportaalByPersonId ?? {},
  };
}
