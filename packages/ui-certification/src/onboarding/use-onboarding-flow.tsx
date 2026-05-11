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
  CERTIFICATION_PHASE_DESCRIPTION,
  CERTIFICATION_PHASE_TITLE,
  COUNTRY_SELECT_NONE,
  ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION,
  REGISTRATION_PHASE_DESCRIPTION,
  REGISTRATION_PHASE_TITLE,
} from "./onboarding-constants";
import {
  buildRegistrationPhaseDescription,
  buildRegistrationPhaseTitle,
} from "./lib/registration-phase-shell-copy";
import {
  buildRows,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyCoreStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
  isRegistrantCaptureValidForContext,
  onboardingReviewRequesterFromContext,
  stepIndex,
} from "./onboarding-flow-helpers";
import { buildOnboardingStepperSteps } from "./onboarding-stepper-model";
import { ONBOARDING_STEPS } from "./onboarding-types";
import { registrationCountryOptionsForRequestOrigin, vatPrototypePresetIdsForOrigin } from "./onboarding-request-origin";
import type { OnboardingStepperStep } from "@procertus-ui/ui-lib";
import type { CertificationRequestDraft } from "../CertificationRequestContext";
import { useMemo } from "react";
import type { CertificationRequestWizardProps } from "../components/certification-request-wizard/CertificationRequestWizard";
import type { OnboardingFlowViewProps } from "./onboarding-flow-view-props";
import { useOnboardingFlowContext } from "./onboarding-flow-provider";
import { isRegistrationIdentifierValidForOrigin } from "./lib/registration-identifier-for-origin";

export type UseOnboardingFlowOptions = {
  navigate: (to: string, options?: { replace?: boolean }) => void;
  welcomePath?: string;
  flowStorageKey?: string;
  certificationRequestStorageKey?: string;
  certificationSessionId?: string;
  /** Merged after flow-derived wizard props (e.g. Storybook may set `backendKind: "memory"`). */
  certificationWizardPropsOverrides?: Partial<CertificationRequestWizardProps>;
};

export function useOnboardingFlow(options: UseOnboardingFlowOptions): {
  redirectToRegistrationComplete: boolean;
  viewProps: OnboardingFlowViewProps;
} {
  const {
    navigate,
    welcomePath = "/welcome",
    certificationRequestStorageKey = ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY,
    certificationSessionId = "pt1:onboarding:certification-request",
    certificationWizardPropsOverrides,
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
    wizardInitialStep,
    requestOrigin,
    prototypeVatPresetId,
    companyFieldHints,
    summaryIncludedDraftIds,
    registrationEntryLabel,
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
  const steps: OnboardingStepperStep[] = useMemo(
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

  const registrationPhaseDescriptionDerived = useMemo(
    () =>
      buildRegistrationPhaseDescription({
        registrationEntryLabel,
        drafts,
        fallbackDescription: REGISTRATION_PHASE_DESCRIPTION,
      }),
    [drafts, registrationEntryLabel],
  );

  const registrationPhaseTitleDerived = useMemo(
    () =>
      buildRegistrationPhaseTitle({
        registrationEntryLabel,
        drafts,
        fallbackTitle: REGISTRATION_PHASE_TITLE,
      }),
    [drafts, registrationEntryLabel],
  );

  const certificationWizardProps: CertificationRequestWizardProps = {
    mode: "onboarding",
    initialDrafts: drafts,
    initialStep: wizardInitialStep,
    backendKind: "localStorage",
    storageKey: certificationRequestStorageKey,
    sessionId: certificationSessionId,
    reviewRequester: onboardingReviewRequesterFromContext(context),
    onCancel: () => navigate(welcomePath),
    onComplete: (nextDrafts: CertificationRequestDraft[]) => {
      api.applyWizardDraftCompletion(nextDrafts);
    },
    ...certificationWizardPropsOverrides,
  };

  const viewProps: OnboardingFlowViewProps = {
    step,
    certificationPhaseTitle: CERTIFICATION_PHASE_TITLE,
    certificationPhaseDescription: CERTIFICATION_PHASE_DESCRIPTION,
    registrationPhaseTitle: registrationPhaseTitleDerived,
    registrationPhaseDescription: registrationPhaseDescriptionDerived,
    onSignInClick: () => navigate(welcomePath),
    certificationWizardProps,
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
