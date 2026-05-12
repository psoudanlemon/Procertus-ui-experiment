import { DEFAULT_VAT_PROTOTYPE_PRESET_ID } from "./lib/vatPrototypePresets";
import type { OnboardingFlowState } from "./onboarding-types";
import { GUEST_INTAKE_CHANNELS, type GuestIntakeChannel } from "./onboarding-types";
import {
  DEFAULT_CONTEXT,
  effectiveIncludedCertificationDraftIds,
  isOnboardingCompanyLegalEntitiesStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
} from "./onboarding-flow-helpers";

function coerceGuestIntakeChannel(raw: unknown): GuestIntakeChannel {
  return typeof raw === "string" && (GUEST_INTAKE_CHANNELS as readonly string[]).includes(raw)
    ? (raw as GuestIntakeChannel)
    : "";
}

export const DEFAULT_ONBOARDING_FLOW_STATE: OnboardingFlowState = {
  trajectServiceId: "",
  guestIntakeChannel: "",
  formalRequestPackageCommitted: false,
  requestOrigin: "",
  drafts: [],
  summaryIncludedDraftIds: [],
  context: DEFAULT_CONTEXT,
  prototypeVatPresetId: DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  companyFieldHints: {},
  summaryKlantenportaalByPersonId: {},
  companyZetelStepCompleted: false,
  companyLegalEntitiesStepCompleted: false,
  invoicingStepCompleted: false,
  extrasStepCompleted: false,
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

  const formalRequestPackageCommitted =
    typeof restStored.formalRequestPackageCommitted === "boolean"
      ? restStored.formalRequestPackageCommitted
      : (restStored.requestOrigin ?? "") !== "";

  const contextMerged = { ...DEFAULT_CONTEXT, ...stored.context };
  const certificationDraftIds = effectiveIncludedCertificationDraftIds(
    migratedDrafts,
    restStored.summaryIncludedDraftIds,
  );
  const companyZetelStepCompleted =
    typeof restStored.companyZetelStepCompleted === "boolean"
      ? restStored.companyZetelStepCompleted
      : contextMerged.headOfficeIsCertificationLegalEntity === "yes" ||
        contextMerged.headOfficeIsCertificationLegalEntity === "no";

  const legalEntitiesContextValid = isOnboardingCompanyLegalEntitiesStepValid(
    contextMerged,
    certificationDraftIds,
  );
  const invoicingContextValid = isOnboardingInvoicingStepValid(
    contextMerged,
    certificationDraftIds,
  );
  const optionalContactsContextValid = isOnboardingOptionalContactsStepValid(contextMerged);

  const companyLegalEntitiesStepCompleted =
    typeof restStored.companyLegalEntitiesStepCompleted === "boolean"
      ? restStored.companyLegalEntitiesStepCompleted
      : companyZetelStepCompleted && legalEntitiesContextValid;

  const invoicingStepCompleted =
    typeof restStored.invoicingStepCompleted === "boolean"
      ? restStored.invoicingStepCompleted
      : companyLegalEntitiesStepCompleted && invoicingContextValid;

  const extrasStepCompleted =
    typeof restStored.extrasStepCompleted === "boolean"
      ? restStored.extrasStepCompleted
      : invoicingStepCompleted && optionalContactsContextValid;

  return {
    ...DEFAULT_ONBOARDING_FLOW_STATE,
    ...restStored,
    drafts: migratedDrafts,
    formalRequestPackageCommitted,
    guestIntakeChannel: coerceGuestIntakeChannel(stored.guestIntakeChannel),
    ...(trimmedLabel ? { registrationEntryLabel: trimmedLabel } : {}),
    context: contextMerged,
    companyFieldHints: stored.companyFieldHints ?? {},
    summaryKlantenportaalByPersonId: stored.summaryKlantenportaalByPersonId ?? {},
    companyZetelStepCompleted,
    companyLegalEntitiesStepCompleted,
    invoicingStepCompleted,
    extrasStepCompleted,
  };
}
