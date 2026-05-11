import type { Dispatch, SetStateAction } from "react";

import type { CertificationRequestDraft } from "../CertificationRequestContext";
import type {
  OnboardingFlowState,
  CustomerContext,
  OnboardingStep,
} from "./onboarding-types";
import {
  customerContextAfterPrototypePresetChange,
  effectiveIncludedCertificationDraftIds,
  mergeCustomerContextDeep,
  resolveFlowContext,
  stepIndex,
} from "./onboarding-flow-helpers";
import {
  findVatPrototypePreset,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";
import {
  defaultPrototypePresetIdForRequestOrigin,
  type OnboardingRequestOrigin,
} from "./onboarding-request-origin";
import { buildOnboardingStepperSteps } from "./onboarding-stepper-model";

const ADDRESS_DETAIL_KEYS: (keyof CustomerContext)[] = [
  "addressStreet",
  "addressHouseNumber",
  "addressPostalCode",
  "addressCity",
];

export type OnboardingFlowApi = {
  /** Narrow updates with hint bookkeeping (same semantics as legacy hook). */
  readonly updateContext: (id: keyof CustomerContext, value: string) => void;
  readonly patchContext: (patch: Partial<CustomerContext>) => void;
  readonly setFlowState: Dispatch<SetStateAction<OnboardingFlowState>>;
  readonly setPrototypeVatPresetFromWizardChoice: (presetId: string) => void;
  readonly setRequestOrigin: (origin: OnboardingRequestOrigin) => void;
  readonly goToOnboardingStep: (nextStep: OnboardingStep) => void;
  /** After certification wizard completes: drafts + jump to origin. */
  readonly applyWizardDraftCompletion: (nextDrafts: CertificationRequestDraft[]) => void;
  /** Pin het Wegwijzer-service id van het lopende traject (zodat de back-link naar Triage refresh-bestendig blijft). */
  readonly setTrajectServiceId: (
    serviceId: string,
    /** Toon voor shell‑kopie in de registratiefase (Wegwijzer / triage). */
    registrationEntryLabel?: string,
  ) => void;
};

type LegacyContext = Partial<CustomerContext> & {
  representativeName?: string;
  kycNotes?: string;
  address?: string;
};

export function createOnboardingFlowApi(
  setFlowState: Dispatch<SetStateAction<OnboardingFlowState>>,
): OnboardingFlowApi {
  const resolvePrevContext = (prev: OnboardingFlowState): CustomerContext =>
    resolveFlowContext(prev.context as LegacyContext);

  return {
    setFlowState,
    updateContext(id, value) {
      setFlowState((prev) => {
        const nextHints = { ...prev.companyFieldHints };
        if (id === "organizationName" || id === "country") {
          delete nextHints[id];
        }
        if (ADDRESS_DETAIL_KEYS.includes(id)) {
          delete nextHints.addressStreet;
        }
        return {
          ...prev,
          companyFieldHints: nextHints,
          context: resolveFlowContext({ ...prev.context, [id]: value }),
        };
      });
    },

    patchContext(patch) {
      setFlowState((prev) => {
        const nextHints = { ...prev.companyFieldHints };
        const addrKeys: (keyof CustomerContext)[] = [
          "addressStreet",
          "addressHouseNumber",
          "addressPostalCode",
          "addressCity",
          "country",
          "invoicingAddressStreet",
          "invoicingAddressHouseNumber",
          "invoicingAddressPostalCode",
          "invoicingAddressCity",
          "invoicingCountry",
        ];
        const touchAddr = addrKeys.some((k) => patch[k] !== undefined);
        if (touchAddr) {
          delete nextHints.addressStreet;
        }
        if (patch.organizationName !== undefined) {
          delete nextHints.organizationName;
        }
        if (patch.country !== undefined) {
          delete nextHints.country;
        }
        return {
          ...prev,
          companyFieldHints: nextHints,
          context: mergeCustomerContextDeep(resolvePrevContext(prev), patch),
        };
      });
    },

    setPrototypeVatPresetFromWizardChoice(presetId) {
      const preset = findVatPrototypePreset(presetId) ?? VAT_PROTOTYPE_PRESETS[0];
      if (!preset) return;
      setFlowState((prev) => ({
        ...prev,
        prototypeVatPresetId: presetId,
        companyFieldHints: {},
        context: customerContextAfterPrototypePresetChange(resolvePrevContext(prev), preset),
      }));
    },

    setRequestOrigin(origin) {
      setFlowState((prev) => {
        const presetId = defaultPrototypePresetIdForRequestOrigin(origin);
        const preset = findVatPrototypePreset(presetId) ?? VAT_PROTOTYPE_PRESETS[0]!;
        const baseContext = resolvePrevContext(prev);
        return {
          ...prev,
          requestOrigin: origin,
          prototypeVatPresetId: preset.id,
          companyFieldHints: {},
          context: customerContextAfterPrototypePresetChange(baseContext, preset),
        };
      });
    },

    applyWizardDraftCompletion(nextDrafts) {
      setFlowState((prev) => {
        const prevDraftIds = new Set(prev.drafts.map((d) => d.id));
        const nextIds = nextDrafts.map((d) => d.id);
        const baseSel = prev.summaryIncludedDraftIds ?? Array.from(prevDraftIds);
        const keptSelection = baseSel.filter((id) => nextIds.includes(id) && prevDraftIds.has(id));
        const newDraftIds = nextIds.filter((id) => !prevDraftIds.has(id));
        const nextSummaryIncluded = Array.from(new Set([...keptSelection, ...newDraftIds]));
        return {
          ...prev,
          drafts: nextDrafts,
          wizardInitialStep: "drafts",
          step: "origin",
          summaryIncludedDraftIds: nextSummaryIncluded,
        };
      });
    },

    setTrajectServiceId(serviceId, registrationEntryLabel) {
      setFlowState((prev) => {
        let nextRegistrationLabel = prev.registrationEntryLabel;
        if (registrationEntryLabel !== undefined) {
          const t = registrationEntryLabel.trim();
          nextRegistrationLabel = t.length > 0 ? t : undefined;
        }
        if (prev.trajectServiceId === serviceId && prev.registrationEntryLabel === nextRegistrationLabel) {
          return prev;
        }
        const nextState: OnboardingFlowState = { ...prev, trajectServiceId: serviceId };
        if (nextRegistrationLabel) {
          nextState.registrationEntryLabel = nextRegistrationLabel;
        } else {
          delete nextState.registrationEntryLabel;
        }
        return nextState;
      });
    },

    goToOnboardingStep(nextStep) {
      setFlowState((prev) => {
        const context = resolvePrevContext(prev);
        const certificationInquiryDraftIds = effectiveIncludedCertificationDraftIds(
          prev.drafts,
          prev.summaryIncludedDraftIds,
        );
        const steps = buildOnboardingStepperSteps({
          step: prev.step,
          drafts: prev.drafts,
          requestOrigin: prev.requestOrigin,
          context,
          certificationInquiryDraftIds,
        });
        const targetIndex = stepIndex(nextStep);
        if (steps[targetIndex]?.available === false) {
          return prev;
        }
        if (nextStep === "request") {
          return {
            ...prev,
            step: nextStep,
            wizardInitialStep: prev.drafts.length > 0 ? "drafts" : "intent",
          };
        }
        return {
          ...prev,
          step: nextStep,
          ...(nextStep === "company" ? { companyFieldHints: {} } : {}),
        };
      });
    },
  };
}
