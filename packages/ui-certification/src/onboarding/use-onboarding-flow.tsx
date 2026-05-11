import { registrationSimulationStepLabels } from "./lib/registrationSubmitSimulation";
import {
  companyFormFieldsPrefilledByMockLookup,
  companyFormFieldsResolvedThroughLookupStep,
  findVatPrototypePreset,
  isVatIdentifierPlausible,
  VAT_PROTOTYPE_PRESETS,
  vatLookupSimulationStepsForPreset,
} from "./lib/vatPrototypePresets";
import {
  ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY,
  readOnboardingRegistrationCompletePayload,
  writeOnboardingRegistrationCompletePayload,
} from "./lib/onboardingRegistrationCompleteSession";
import {
  COUNTRY_SELECT_NONE,
  ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION,
  REGISTRATION_PHASE_DESCRIPTION,
  REGISTRATION_PHASE_TITLE,
} from "./onboarding-constants";
import {
  buildRows,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyCoreStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
  isRegistrantCaptureValidForContext,
  stepIndex,
} from "./onboarding-flow-helpers";
import { buildOnboardingStepperSteps } from "./onboarding-stepper-model";
import { ONBOARDING_STEPS } from "./onboarding-types";
import { registrationCountryOptionsForRequestOrigin, vatPrototypePresetIdsForOrigin } from "./onboarding-request-origin";
import type { StepLayoutStep } from "@procertus-ui/ui";
import { useMemo } from "react";
import type { OnboardingFlowViewProps } from "./onboarding-flow-view-props";
import { useOnboardingFlowContext } from "./onboarding-flow-provider";
import { isRegistrationIdentifierValidForOrigin } from "./lib/registration-identifier-for-origin";

export type UseOnboardingFlowOptions = {
  navigate: (to: string, options?: { replace?: boolean }) => void;
  welcomePath?: string;
  flowStorageKey?: string;
};

export function useOnboardingFlow(options: UseOnboardingFlowOptions): {
  redirectToRegistrationComplete: boolean;
  viewProps: OnboardingFlowViewProps;
} {
  const {
    navigate,
    welcomePath = "/welcome",
    flowStorageKey: _flowStorageKey,
  } = options;

  void _flowStorageKey;

  const {
    flowState,
    setFlowState,
    api,
    resolvedContext: context,
    companyLookupPhase,
    lookupProgress,
    lookupStepIndex,
    registrationSubmitOpen,
    setRegistrationSubmitOpen,
    registrationProgress,
    registrationStepIndex,
    setRegistrationProgress,
    setRegistrationStepIndex,
  } = useOnboardingFlowContext();

  const {
    drafts,
    step,
    requestOrigin,
    prototypeVatPresetId,
    companyFieldHints,
    summaryIncludedDraftIds,
  } = flowState;
  const companyHints = companyFieldHints ?? {};

  const effectiveSummaryIncludedDraftIds = useMemo(() => {
    const ids = drafts.map((d) => d.id);
    if (summaryIncludedDraftIds === undefined) return ids;
    return summaryIncludedDraftIds.filter((id) => ids.includes(id));
  }, [drafts, summaryIncludedDraftIds]);

  const registrationSimulationLabels = useMemo(
    () => registrationSimulationStepLabels(effectiveSummaryIncludedDraftIds.length),
    [effectiveSummaryIncludedDraftIds.length],
  );

  const countrySelectOptions = useMemo(() => {
    if (!requestOrigin) {
      return registrationCountryOptionsForRequestOrigin("other", context.country);
    }
    return registrationCountryOptionsForRequestOrigin(requestOrigin, context.country);
  }, [requestOrigin, context.country]);

  const countrySelectValue = useMemo(() => {
    const t = context.country?.trim() ?? "";
    return t && countrySelectOptions.includes(t) ? t : COUNTRY_SELECT_NONE;
  }, [context.country, countrySelectOptions]);

  const allowedVatPrototypePresetIds = useMemo(() => {
    if (!requestOrigin) return VAT_PROTOTYPE_PRESETS.map((p) => p.id);
    return [...vatPrototypePresetIdsForOrigin(requestOrigin)];
  }, [requestOrigin]);

  const vatPrototypePresetChoices = useMemo(
    () => VAT_PROTOTYPE_PRESETS.filter((p) => allowedVatPrototypePresetIds.includes(p.id)),
    [allowedVatPrototypePresetIds],
  );

  const activeStep = stepIndex(step);
  const hasDrafts = drafts.length > 0;
  const certificationInquiryDraftIds = useMemo(() => drafts.map((d) => d.id), [drafts]);
  const hasCustomerContext =
    (context.applicantIsLegalRepresentative === "yes" ||
      context.applicantIsLegalRepresentative === "no") &&
    isRegistrantCaptureValidForContext(context) &&
    isLegalRepresentativeCaptureComplete(context) &&
    (requestOrigin
      ? isRegistrationIdentifierValidForOrigin(context.vatNumber ?? "", requestOrigin)
      : isVatIdentifierPlausible(context.vatNumber ?? ""));
  const companyCoreOk =
    isOnboardingCompanyCoreStepValid(context, certificationInquiryDraftIds) ||
    ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const invoicingStepOk =
    isOnboardingInvoicingStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const optionalContactsOk =
    isOnboardingOptionalContactsStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const registrationStepOk = hasCustomerContext || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const companyStepOk = companyCoreOk;
  const extrasStepOk = optionalContactsOk;
  const steps: StepLayoutStep[] = useMemo(
    () =>
      buildOnboardingStepperSteps({
        step,
        drafts,
        requestOrigin,
        context,
        certificationInquiryDraftIds,
      }),
    [
      context,
      drafts,
      certificationInquiryDraftIds,
      requestOrigin,
      step,
    ],
  );

  const updateContext = api.updateContext;
  const patchContext = api.patchContext;
  const setRequestOrigin = api.setRequestOrigin;
  const goToOnboardingStep = api.goToOnboardingStep;

  const activeVatPreset = useMemo(
    () => findVatPrototypePreset(prototypeVatPresetId) ?? VAT_PROTOTYPE_PRESETS[0]!,
    [prototypeVatPresetId],
  );

  const vatLookupStepLabels = useMemo(
    () => vatLookupSimulationStepsForPreset(activeVatPreset),
    [activeVatPreset],
  );

  const companyPrefillFieldKeys = useMemo(
    () =>
      companyFormFieldsPrefilledByMockLookup({
        vatNumber: context.vatNumber,
        representativeEmail: context.representativeEmail,
        preset: activeVatPreset,
      }),
    [activeVatPreset, context.representativeEmail, context.vatNumber],
  );

  const completedCompanySimulationStepIndex = useMemo(() => {
    if (companyLookupPhase === "ready" || lookupProgress >= 100) return 4;
    if (lookupStepIndex <= 0) return -1;
    return Math.min(lookupStepIndex - 1, 4);
  }, [companyLookupPhase, lookupProgress, lookupStepIndex]);

  const companyFieldsResolvedInSimulation = useMemo(
    () =>
      companyFormFieldsResolvedThroughLookupStep(completedCompanySimulationStepIndex, {
        vatNumber: context.vatNumber,
        representativeEmail: context.representativeEmail,
        preset: activeVatPreset,
      }),
    [
      activeVatPreset,
      completedCompanySimulationStepIndex,
      context.representativeEmail,
      context.vatNumber,
    ],
  );

  const vatNumberForDisplay = context.vatNumber.trim();
  const emailForDisplay = context.representativeEmail.trim();

  const registrationCompleteRedirect = useMemo(
    () => readOnboardingRegistrationCompletePayload(),
    [],
  );

  const primaryAction =
    step === "origin"
      ? {
          label: "Verder",
          onClick: () => goToOnboardingStep("customer"),
          disabled: requestOrigin === "",
        }
      : step === "customer"
        ? {
            label: "Verder",
            onClick: () => goToOnboardingStep("company"),
            disabled: !registrationStepOk,
          }
        : step === "company"
          ? {
              label: "Verder",
              onClick: () => goToOnboardingStep("invoicing"),
              disabled: !companyStepOk || companyLookupPhase !== "ready",
            }
          : step === "invoicing"
            ? {
                label: "Verder",
                onClick: () => goToOnboardingStep("extras"),
                disabled: !invoicingStepOk,
              }
            : step === "extras"
              ? {
                  label: "Verder",
                  onClick: () => setFlowState((prev) => ({ ...prev, step: "summary" })),
                  disabled: !extrasStepOk,
                }
              : step === "summary"
                ? {
                    label: "Indienen",
                    onClick: () => {
                      const certificationStoreRaw =
                        typeof localStorage !== "undefined"
                          ? localStorage.getItem(ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY)
                          : null;
                      writeOnboardingRegistrationCompletePayload({
                        representativeEmail: context.representativeEmail.trim(),
                        organizationName: context.organizationName.trim(),
                        includedInquiryCount: effectiveSummaryIncludedDraftIds.length,
                        flowStateSnapshot: flowState,
                        certificationStoreRaw,
                      });
                      setRegistrationProgress(0);
                      setRegistrationStepIndex(-1);
                      setRegistrationSubmitOpen(true);
                    },
                    disabled:
                      !hasDrafts ||
                      effectiveSummaryIncludedDraftIds.length === 0 ||
                      registrationSubmitOpen,
                  }
                : { label: "Doorgaan", onClick: () => {}, disabled: true };

  const viewProps: OnboardingFlowViewProps = {
    step,
    registrationPhaseTitle: REGISTRATION_PHASE_TITLE,
    registrationPhaseDescription: REGISTRATION_PHASE_DESCRIPTION,
    onSignInClick: () => navigate(welcomePath),
    registrationSubmitOpen,
    onRegistrationSubmitOpenChange: (next) => {
      if (next) setRegistrationSubmitOpen(true);
    },
    registrationProgress,
    registrationStepIndex,
    registrationSimulationLabels,
    context,
    updateContext,
    patchContext,
    setFlowState,
    drafts,
    effectiveSummaryIncludedDraftIds,
    rows: buildRows(context, drafts, effectiveSummaryIncludedDraftIds, {
      includeDraftRows: false,
    }),
    steps,
    activeStep,
    goToOnboardingStep,
    primaryAction,
    backAction: {
      label: "Terug",
      onClick: () => {
        const previous = ONBOARDING_STEPS[Math.max(0, activeStep - 1)];
        if (previous) setFlowState((prev) => ({ ...prev, step: previous }));
      },
    },
    companyLookupPhase,
    lookupProgress,
    lookupStepIndex,
    vatLookupStepLabels,
    companyPrefillFieldKeys,
    companyFieldsResolvedInSimulation,
    vatNumberForDisplay,
    emailForDisplay,
    activeVatPreset,
    prototypeVatPresetId,
    requestOrigin,
    setRequestOrigin,
    vatPrototypePresetChoices,
    countrySelectOptions,
    countrySelectValue,
    companyHints,
    summaryKlantenportaalByPersonId: flowState.summaryKlantenportaalByPersonId ?? {},
  };

  return {
    redirectToRegistrationComplete: !!registrationCompleteRedirect,
    viewProps,
  };
}
