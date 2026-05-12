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
  buildRegistrationPhaseDescription,
  buildRegistrationPhaseTitle,
} from "./lib/registration-phase-shell-copy";
import {
  buildRows,
  effectiveIncludedCertificationDraftIds,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyLegalEntitiesStepValid,
  isOnboardingCompanyZetelStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
  isRegistrantCaptureValidForContext,
  stepIndex,
} from "./onboarding-flow-helpers";
import type { OnboardingStep } from "./onboarding-types";
import { ONBOARDING_STEPS } from "./onboarding-types";
import {
  registrationCountryOptionsForRequestOrigin,
  vatPrototypePresetIdsForOrigin,
} from "./onboarding-request-origin";
import type { StepLayoutStep } from "@procertus-ui/ui";
import { useCallback, useMemo, type ReactNode } from "react";
import type { OnboardingFlowViewProps } from "./onboarding-flow-view-props";
import { buildOnboardingStepperSteps } from "./onboarding-stepper-model";
import { useOnboardingFlowContext } from "./onboarding-flow-provider";
import { isRegistrationIdentifierValidForOrigin } from "./lib/registration-identifier-for-origin";

export type UseOnboardingFlowOptions = {
  navigate: (to: string, options?: { replace?: boolean }) => void;
  /** Current registration / wizard step (URL or host-controlled). */
  activeStep: OnboardingStep;
  /** Called after optional flow-state side effects when {@link activeStep} should change. */
  onRegistrationStepChange: (next: OnboardingStep) => void;
  welcomePath?: string;
  flowStorageKey?: string;
  /** Leading registry header slot (e.g. color mode). */
  registryHeaderLeadingActions?: ReactNode;
  /** Trailing registry header slot (e.g. inquiry cart). */
  registryHeaderTrailingActions?: ReactNode;
  /** Guest login route (header `loginUrl` + `onSignInClick` target). Default `/login`. */
  signInUrl?: string;
  /**
   * Guest language chip placement. Default `"leading"` for extranet onboarding (language in
   * {@link registryHeaderLeadingActions}). Use `"trailing"` for Storybook / legacy layouts.
   */
  guestLanguagePlacement?: OnboardingFlowViewProps["guestLanguagePlacement"];
};

export function useOnboardingFlow(options: UseOnboardingFlowOptions): {
  redirectToRegistrationComplete: boolean;
  viewProps: OnboardingFlowViewProps;
} {
  const {
    navigate,
    activeStep,
    onRegistrationStepChange,
    welcomePath = "/welcome",
    registryHeaderLeadingActions,
    registryHeaderTrailingActions,
    signInUrl = "/login",
    guestLanguagePlacement = "leading",
    flowStorageKey: _flowStorageKey,
  } = options;

  void _flowStorageKey;
  void welcomePath;

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

  const { updateContext, patchContext, setRequestOrigin } = api;

  const {
    drafts,
    requestOrigin,
    prototypeVatPresetId,
    companyFieldHints,
    summaryIncludedDraftIds,
    registrationEntryLabel,
  } = flowState;
  const companyHints = companyFieldHints ?? {};

  const effectiveSummaryIncludedDraftIds = useMemo(
    () => effectiveIncludedCertificationDraftIds(drafts, summaryIncludedDraftIds),
    [drafts, summaryIncludedDraftIds],
  );

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

  const stepperActiveIndex = stepIndex(activeStep);
  const hasDrafts = drafts.length > 0;
  const certificationInquiryDraftIds = effectiveSummaryIncludedDraftIds;
  const hasCustomerContext =
    (context.applicantIsLegalRepresentative === "yes" ||
      context.applicantIsLegalRepresentative === "no") &&
    isRegistrantCaptureValidForContext(context) &&
    isLegalRepresentativeCaptureComplete(context) &&
    (requestOrigin
      ? isRegistrationIdentifierValidForOrigin(context.vatNumber ?? "", requestOrigin)
      : isVatIdentifierPlausible(context.vatNumber ?? ""));
  const companyZetelOk =
    isOnboardingCompanyZetelStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const companyLegalEntitiesOk = isOnboardingCompanyLegalEntitiesStepValid(
    context,
    certificationInquiryDraftIds,
  );
  const invoicingStepOk =
    isOnboardingInvoicingStepValid(context, certificationInquiryDraftIds) ||
    ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const optionalContactsOk =
    isOnboardingOptionalContactsStepValid(context) || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const registrationStepOk = hasCustomerContext || ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION;
  const extrasStepOk = optionalContactsOk;
  const steps: StepLayoutStep[] = useMemo(
    () =>
      buildOnboardingStepperSteps({
        step: activeStep,
        drafts,
        requestOrigin,
        context,
        certificationInquiryDraftIds,
      }),
    [activeStep, context, drafts, certificationInquiryDraftIds, requestOrigin],
  );

  const goToOnboardingStep = useCallback(
    (nextStep: OnboardingStep) => {
      const certificationInquiryDraftIdsInner = effectiveIncludedCertificationDraftIds(
        flowState.drafts,
        flowState.summaryIncludedDraftIds,
      );
      const stepperModel = buildOnboardingStepperSteps({
        step: activeStep,
        drafts: flowState.drafts,
        requestOrigin: flowState.requestOrigin,
        context,
        certificationInquiryDraftIds: certificationInquiryDraftIdsInner,
      });
      const targetIndex = stepIndex(nextStep);
      if (stepperModel[targetIndex]?.available === false) {
        return;
      }
      setFlowState((prev) => {
        if (nextStep === "company") {
          return { ...prev, companyFieldHints: {} };
        }
        return prev;
      });
      onRegistrationStepChange(nextStep);
    },
    [
      activeStep,
      context,
      flowState.drafts,
      flowState.requestOrigin,
      flowState.summaryIncludedDraftIds,
      onRegistrationStepChange,
      setFlowState,
    ],
  );

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
    activeStep === "origin"
      ? {
          label: "Verder",
          onClick: () => goToOnboardingStep("customer"),
          disabled: requestOrigin === "",
        }
      : activeStep === "customer"
        ? {
            label: "Verder",
            onClick: () => goToOnboardingStep("company"),
            disabled: !registrationStepOk,
          }
        : activeStep === "company"
          ? {
              label: "Verder",
              onClick: () => goToOnboardingStep("companyLegalEntities"),
              disabled: !companyZetelOk || companyLookupPhase !== "ready",
            }
          : activeStep === "companyLegalEntities"
            ? {
                label: "Verder",
                onClick: () => goToOnboardingStep("invoicing"),
                disabled: !companyLegalEntitiesOk,
              }
            : activeStep === "invoicing"
              ? {
                  label: "Verder",
                  onClick: () => goToOnboardingStep("extras"),
                  disabled: !invoicingStepOk,
                }
              : activeStep === "extras"
                ? {
                    label: "Verder",
                    onClick: () => goToOnboardingStep("summary"),
                    disabled: !extrasStepOk,
                  }
                : activeStep === "summary"
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

  const viewProps: OnboardingFlowViewProps = {
    step: activeStep,
    registrationPhaseTitle: registrationPhaseTitleDerived,
    registrationPhaseDescription: registrationPhaseDescriptionDerived,
    onSignInClick: () => navigate(signInUrl),
    signInUrl,
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
    activeStep: stepperActiveIndex,
    goToOnboardingStep,
    primaryAction,
    backAction: {
      label: "Terug",
      onClick: () => {
        const previous = ONBOARDING_STEPS[Math.max(0, stepperActiveIndex - 1)];
        if (previous) onRegistrationStepChange(previous);
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
    registryHeaderLeadingActions,
    registryHeaderTrailingActions,
    guestLanguagePlacement,
  };

  return {
    redirectToRegistrationComplete: !!registrationCompleteRedirect,
    viewProps,
  };
}
