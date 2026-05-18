import { DEFAULT_VAT_PROTOTYPE_PRESET_ID } from "./lib/vatPrototypePresets";
import type {
  InnovationAttestCapture,
  InnovationAttestInquiryState,
  MetrologyCapture,
  MetrologyInquiryState,
  OnboardingFlowState,
} from "./onboarding-types";
import { GUEST_INTAKE_CHANNELS, type GuestIntakeChannel } from "./onboarding-types";
import {
  createEmptyInnovationAttestInquiry,
  normalizeInnovationAttestCapture,
  normalizeInnovationAttestInquiry,
} from "./onboarding-innovation-attest";
import {
  createEmptyMetrologyInquiry,
  normalizeMetrologyCapture,
  normalizeMetrologyInquiry,
} from "./onboarding-metrology";
import {
  DEFAULT_CONTEXT,
  effectiveIncludedCertificationDraftIds,
  isOnboardingCompanyLegalEntitiesStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
} from "./onboarding-flow-helpers";
import { normalizeRequestOriginFromStored } from "./onboarding-request-origin";

function coerceGuestIntakeChannel(raw: unknown): GuestIntakeChannel {
  return typeof raw === "string" && (GUEST_INTAKE_CHANNELS as readonly string[]).includes(raw)
    ? (raw as GuestIntakeChannel)
    : "";
}

/** Migrates legacy top-level innovation keys into {@link OnboardingFlowState.innovationAttestInquiry}. */
function migrateInnovationAttestInquiryFromStored(stored: {
  innovationAttestInquiry?: Partial<InnovationAttestInquiryState>;
  innovationAttestCapture?: InnovationAttestCapture;
  innovationAttestStepCompleted?: boolean;
}): InnovationAttestInquiryState {
  const nested = stored.innovationAttestInquiry;
  if (nested && typeof nested === "object") {
    return normalizeInnovationAttestInquiry({
      capture: normalizeInnovationAttestCapture(nested.capture),
      stepCompleted:
        typeof nested.stepCompleted === "boolean"
          ? nested.stepCompleted
          : typeof stored.innovationAttestStepCompleted === "boolean"
            ? stored.innovationAttestStepCompleted
            : false,
    });
  }
  return normalizeInnovationAttestInquiry({
    capture: normalizeInnovationAttestCapture(stored.innovationAttestCapture),
    stepCompleted:
      typeof stored.innovationAttestStepCompleted === "boolean"
        ? stored.innovationAttestStepCompleted
        : false,
  });
}

/** Migrates legacy top-level keys into {@link OnboardingFlowState.metrologyInquiry}. */
function migrateMetrologyInquiryFromStored(stored: {
  metrologyInquiry?: Partial<MetrologyInquiryState>;
  metrologyCapture?: MetrologyCapture;
  metrologyStepCompleted?: boolean;
}): MetrologyInquiryState {
  const nested = stored.metrologyInquiry;
  if (nested && typeof nested === "object") {
    return normalizeMetrologyInquiry({
      capture: normalizeMetrologyCapture(nested.capture),
      stepCompleted:
        typeof nested.stepCompleted === "boolean"
          ? nested.stepCompleted
          : typeof stored.metrologyStepCompleted === "boolean"
            ? stored.metrologyStepCompleted
            : false,
    });
  }
  return normalizeMetrologyInquiry({
    capture: normalizeMetrologyCapture(stored.metrologyCapture),
    stepCompleted:
      typeof stored.metrologyStepCompleted === "boolean"
        ? stored.metrologyStepCompleted
        : false,
  });
}

export const DEFAULT_ONBOARDING_FLOW_STATE: OnboardingFlowState = {
  trajectServiceId: "",
  guestIntakeChannel: "",
  submissionNote: "",
  formalRequestPackageCommitted: false,
  requestOrigin: "",
  drafts: [],
  summaryIncludedDraftIds: [],
  context: DEFAULT_CONTEXT,
  prototypeVatPresetId: DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  companyFieldHints: {},
  summaryKlantenportaalByPersonId: {},
  companyZetelStepCompleted: false,
  innovationAttestInquiry: createEmptyInnovationAttestInquiry(),
  metrologyInquiry: createEmptyMetrologyInquiry(),
  companyLegalEntitiesStepCompleted: false,
  invoicingStepCompleted: false,
  extrasStepCompleted: false,
};

export function hydrateOnboardingFlowStateFromStored(
  stored: OnboardingFlowState | null | undefined,
): OnboardingFlowState {
  if (!stored) return DEFAULT_ONBOARDING_FLOW_STATE;

  const compat = stored as Partial<OnboardingFlowState> & {
    step?: unknown;
    innovationAttestCapture?: InnovationAttestCapture;
    innovationAttestStepCompleted?: boolean;
    metrologyCapture?: MetrologyCapture;
    metrologyStepCompleted?: boolean;
  };

  const {
    step: _legacyStep,
    registrationEntryLabel: rawEntryLabel,
    innovationAttestCapture: legacyInnovCapture,
    innovationAttestStepCompleted: legacyInnovStepDone,
    innovationAttestInquiry: legacyInnovInquiry,
    metrologyCapture: legacyMetrologyCapture,
    metrologyStepCompleted: legacyMetrologyStepDone,
    metrologyInquiry: legacyMetrologyInquiry,
    ...restStored
  } = compat;

  const innovationAttestInquiry = migrateInnovationAttestInquiryFromStored({
    innovationAttestInquiry: legacyInnovInquiry,
    innovationAttestCapture: legacyInnovCapture,
    innovationAttestStepCompleted: legacyInnovStepDone,
  });

  const metrologyInquiry = migrateMetrologyInquiryFromStored({
    metrologyInquiry: legacyMetrologyInquiry,
    metrologyCapture: legacyMetrologyCapture,
    metrologyStepCompleted: legacyMetrologyStepDone,
  });

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
    migratedDrafts,
  );
  const invoicingContextValid = isOnboardingInvoicingStepValid(
    contextMerged,
    certificationDraftIds,
    migratedDrafts,
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
    requestOrigin: normalizeRequestOriginFromStored(restStored.requestOrigin),
    drafts: migratedDrafts,
    formalRequestPackageCommitted,
    guestIntakeChannel: coerceGuestIntakeChannel(stored.guestIntakeChannel),
    ...(trimmedLabel ? { registrationEntryLabel: trimmedLabel } : {}),
    context: contextMerged,
    companyFieldHints: stored.companyFieldHints ?? {},
    summaryKlantenportaalByPersonId: stored.summaryKlantenportaalByPersonId ?? {},
    companyZetelStepCompleted,
    innovationAttestInquiry,
    metrologyInquiry,
    companyLegalEntitiesStepCompleted,
    invoicingStepCompleted,
    extrasStepCompleted,
  };
}
