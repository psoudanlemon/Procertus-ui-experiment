import {
  REGISTRATION_SUBMIT_REDIRECT_DELAY_MS,
  registrationSimulationStepLabels,
} from "./lib/registrationSubmitSimulation";
import { useLocalStorageState } from "./lib/useLocalStorageState";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  enrichRegistrationContext,
  findVatPrototypePreset,
  isVatIdentifierPlausible,
  registrationIsoCodeFromDutchCountryLabel,
  vatLookupSimulationStepsForPreset,
  companyFormFieldsPrefilledByMockLookup,
  companyFormFieldsResolvedThroughLookupStep,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";
import { isRegistrationIdentifierValidForOrigin } from "./lib/registration-identifier-for-origin";
import {
  ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY,
  ONBOARDING_FLOW_STORAGE_KEY,
  readOnboardingRegistrationCompletePayload,
  writeOnboardingRegistrationCompletePayload,
} from "./lib/onboardingRegistrationCompleteSession";
import {
  CERTIFICATION_PHASE_DESCRIPTION,
  CERTIFICATION_PHASE_TITLE,
  COUNTRY_SELECT_NONE,
  ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  REGISTRATION_PHASE_DESCRIPTION,
  REGISTRATION_PHASE_TITLE,
} from "./anonymous-onboarding-constants";
import {
  buildRows,
  customerContextAfterPrototypePresetChange,
  formatRequesterStepperLabel,
  isLegalRepresentativeCaptureComplete,
  isOnboardingCompanyCoreStepValid,
  isOnboardingInvoicingStepValid,
  isOnboardingOptionalContactsStepValid,
  isRegistrantCaptureValidForContext,
  mergeCustomerContextDeep,
  onboardingReviewRequesterFromContext,
  prototypeOptionalDemoContextPatch,
  readInitialCompanyLookupPhase,
  resolveFlowContext,
  stepIndex,
} from "./anonymous-onboarding-flow-helpers";
import type {
  AnonymousOnboardingFlowState,
  CustomerContext,
  OnboardingStep,
} from "./anonymous-onboarding-types";
import { ONBOARDING_STEPS } from "./anonymous-onboarding-types";
import {
  defaultPrototypePresetIdForRequestOrigin,
  firmaCountryLabelLockedForOrigin,
  registrationCountryOptionsForRequestOrigin,
  vatPrototypePresetIdsForOrigin,
  type OnboardingRequestOrigin,
} from "./onboarding-request-origin";
import { DEFAULT_CONTEXT } from "./anonymous-onboarding-flow-helpers";
import type { OnboardingStepperStep } from "@procertus-ui/ui-lib";
import type { CertificationRequestDraft } from "../CertificationRequestContext";
import { useEffect, useMemo, useState } from "react";
import type { CertificationRequestWizardProps } from "../components/certification-request-wizard/CertificationRequestWizard";
import type { AnonymousOnboardingFlowViewProps } from "./anonymous-onboarding-flow-view-props";

const ADDRESS_DETAIL_KEYS: (keyof CustomerContext)[] = [
  "addressStreet",
  "addressHouseNumber",
  "addressPostalCode",
  "addressCity",
];

const DEFAULT_ONBOARDING_FLOW_STATE: AnonymousOnboardingFlowState = {
  step: "request",
  requestOrigin: "",
  drafts: [],
  summaryIncludedDraftIds: [],
  context: DEFAULT_CONTEXT,
  wizardInitialStep: "intent",
  prototypeVatPresetId: DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  companyFieldHints: {},
  summaryKlantenportaalByPersonId: {},
};

export type UseAnonymousOnboardingFlowOptions = {
  navigate: (to: string, options?: { replace?: boolean }) => void;
  welcomePath?: string;
  registrationCompletePath?: string;
  flowStorageKey?: string;
  certificationRequestStorageKey?: string;
  certificationSessionId?: string;
};

export function useAnonymousOnboardingFlow(options: UseAnonymousOnboardingFlowOptions): {
  redirectToRegistrationComplete: boolean;
  viewProps: AnonymousOnboardingFlowViewProps;
} {
  const {
    navigate,
    welcomePath = "/welcome",
    registrationCompletePath = ONBOARDING_REGISTRATION_COMPLETE_PATH,
    flowStorageKey = ONBOARDING_FLOW_STORAGE_KEY,
    certificationRequestStorageKey = ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY,
    certificationSessionId = "pt1:onboarding:certification-request",
  } = options;

  const [registrationSubmitOpen, setRegistrationSubmitOpen] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState(0);
  const [registrationStepIndex, setRegistrationStepIndex] = useState(-1);
  const [flowState, setFlowState] = useLocalStorageState(
    flowStorageKey,
    DEFAULT_ONBOARDING_FLOW_STATE,
  );
  const {
    drafts,
    step,
    wizardInitialStep,
    requestOrigin,
    prototypeVatPresetId,
    companyFieldHints,
    summaryIncludedDraftIds,
  } = flowState;
  const context = useMemo(() => resolveFlowContext(flowState.context), [flowState.context]);
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

  useEffect(() => {
    if (!registrationSubmitOpen) return;
    let cancelled = false;
    const timeoutIds: number[] = [];
    const schedule = (delayMs: number, fn: () => void) => {
      timeoutIds.push(
        window.setTimeout(() => {
          if (!cancelled) fn();
        }, delayMs),
      );
    };
    schedule(150, () => {
      setRegistrationProgress(12);
      setRegistrationStepIndex(0);
    });
    schedule(750, () => {
      setRegistrationProgress(34);
      setRegistrationStepIndex(1);
    });
    schedule(1400, () => {
      setRegistrationProgress(56);
      setRegistrationStepIndex(2);
    });
    schedule(2100, () => {
      setRegistrationProgress(78);
      setRegistrationStepIndex(3);
    });
    schedule(2900, () => {
      if (!cancelled) {
        setRegistrationProgress(100);
      }
    });
    schedule(2900 + REGISTRATION_SUBMIT_REDIRECT_DELAY_MS, () => {
      if (!cancelled) {
        navigate(registrationCompletePath);
      }
    });
    return () => {
      cancelled = true;
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [registrationSubmitOpen, navigate, registrationCompletePath]);

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

  const setRequestOrigin = (origin: OnboardingRequestOrigin) => {
    setFlowState((prev) => {
      const presetId = defaultPrototypePresetIdForRequestOrigin(origin);
      const preset = findVatPrototypePreset(presetId) ?? VAT_PROTOTYPE_PRESETS[0]!;
      const baseContext = resolveFlowContext(
        prev.context as Partial<CustomerContext> & {
          representativeName?: string;
          kycNotes?: string;
          address?: string;
        },
      );
      return {
        ...prev,
        requestOrigin: origin,
        prototypeVatPresetId: preset.id,
        companyFieldHints: {},
        context: customerContextAfterPrototypePresetChange(baseContext, preset),
      };
    });
  };

  useEffect(() => {
    if (!requestOrigin) return;
    const allowed = vatPrototypePresetIdsForOrigin(requestOrigin);
    if (allowed.includes(prototypeVatPresetId)) return;
    const preset = findVatPrototypePreset(allowed[0]!) ?? VAT_PROTOTYPE_PRESETS[0];
    if (!preset) return;
    setFlowState((prev) => ({
      ...prev,
      prototypeVatPresetId: preset.id,
      companyFieldHints: {},
      context: customerContextAfterPrototypePresetChange(
        resolveFlowContext(
          prev.context as Partial<CustomerContext> & {
            representativeName?: string;
            kycNotes?: string;
            address?: string;
          },
        ),
        preset,
      ),
    }));
  }, [requestOrigin, prototypeVatPresetId, setFlowState]);

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
  const summaryStepOk = companyCoreOk && invoicingStepOk && optionalContactsOk;
  const steps: OnboardingStepperStep[] = useMemo(
    () => [
      {
        id: "request",
        title: "Aanvraag",
        description:
          step !== "request" && drafts.length > 0
            ? `${drafts.length} concept${drafts.length === 1 ? "" : "en"} vastgelegd`
            : drafts.length > 0
              ? `${drafts.length} concepten`
              : "Start zonder account",
        available: true,
      },
      {
        id: "origin",
        title: "Land of regio",
        description:
          requestOrigin === ""
            ? "Waar is uw bedrijf?"
            : ({
                be: "België",
                nl: "Nederland",
                eu: "Europa (EU)",
                us: "Verenigde Staten",
                other: "Anders",
              }[requestOrigin] ?? ""),
        available: hasDrafts,
      },
      {
        id: "customer",
        title: "Registratie",
        description: formatRequesterStepperLabel(context),
        available: hasDrafts && requestOrigin !== "",
      },
      {
        id: "company",
        title: "Bedrijfsgegevens",
        description:
          context.organizationName.trim() ||
          (context.headOfficeIsCertificationLegalEntity === "no"
            ? "Maatschappelijke zetel · vestigingen"
            : "Maatschappelijke zetel"),
        available: hasDrafts && requestOrigin !== "" && registrationStepOk,
      },
      {
        id: "invoicing",
        title: "Facturatie",
        description:
          context.invoicingEmail.trim() ||
          (context.invoicingDiffersFromHeadOffice ? "Vestiging voor facturatie" : "Zetel als facturatie"),
        available: hasDrafts && requestOrigin !== "" && registrationStepOk && companyCoreOk,
      },
      {
        id: "extras",
        title: "Extra contacten",
        description: "Certificatie- en reservecontact (optioneel)",
        available:
          hasDrafts && requestOrigin !== "" && registrationStepOk && companyCoreOk && invoicingStepOk,
      },
      {
        id: "summary",
        title: "Nazicht",
        description: "Gegevens en aanvragen nakijken",
        available: hasDrafts && requestOrigin !== "" && registrationStepOk && summaryStepOk,
      },
    ],
    [
      context,
      drafts,
      companyCoreOk,
      invoicingStepOk,
      registrationStepOk,
      requestOrigin,
      step,
      summaryStepOk,
    ],
  );

  const updateContext = (id: keyof CustomerContext, value: string) => {
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
  };

  const patchContext = (patch: Partial<CustomerContext>) => {
    setFlowState((prev) => {
      let nextHints = { ...prev.companyFieldHints };
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
        context: mergeCustomerContextDeep(resolveFlowContext(prev.context), patch),
      };
    });
  };

  /** Normalize context from storage (missing keys, legacy `representativeName`, step/preset fixes). */
  useEffect(() => {
    setFlowState((prev) => {
      const fixes: Partial<AnonymousOnboardingFlowState> = {};
      let migratedStep = prev.step;
      if ((migratedStep as string) === "kyc") migratedStep = "company";
      if ((migratedStep as string) === "profile") migratedStep = "summary";
      if ((migratedStep as string) === "activation") migratedStep = "summary";
      if ((migratedStep as string) === "review") migratedStep = "summary";
      if ((migratedStep as string) === "intake") migratedStep = "customer";
      if (!ONBOARDING_STEPS.includes(migratedStep)) migratedStep = "request";
      if (migratedStep !== prev.step) {
        fixes.step = migratedStep;
      }
      if (prev.requestOrigin === undefined) {
        fixes.requestOrigin = "";
        const resumeStep = (fixes.step ?? migratedStep) as OnboardingStep;
        if (
          prev.drafts.length > 0 &&
          (resumeStep === "customer" ||
            resumeStep === "company" ||
            resumeStep === "invoicing" ||
            resumeStep === "extras" ||
            resumeStep === "summary")
        ) {
          fixes.step = "origin";
        }
      }
      if (prev.summaryIncludedDraftIds === undefined && prev.drafts.length > 0) {
        fixes.summaryIncludedDraftIds = prev.drafts.map((d) => d.id);
      }
      if (!prev.prototypeVatPresetId) {
        fixes.prototypeVatPresetId = DEFAULT_VAT_PROTOTYPE_PRESET_ID;
      }
      if (prev.companyFieldHints === undefined) {
        fixes.companyFieldHints = {};
      }
      const nextContext = resolveFlowContext(
        prev.context as Partial<CustomerContext> & {
          representativeName?: string;
          kycNotes?: string;
          address?: string;
        },
      );
      const candidateStep = (fixes.step ?? prev.step) as OnboardingStep;
      if (
        !ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION &&
        (candidateStep === "extras" || candidateStep === "summary") &&
        !isOnboardingInvoicingStepValid(nextContext)
      ) {
        fixes.step = "invoicing";
      }
      if (JSON.stringify(nextContext) !== JSON.stringify(prev.context)) {
        fixes.context = nextContext;
      }
      return Object.keys(fixes).length === 0 ? prev : { ...prev, ...fixes };
    });
  }, [setFlowState]);

  const activeVatPreset = useMemo(
    () => findVatPrototypePreset(prototypeVatPresetId) ?? VAT_PROTOTYPE_PRESETS[0]!,
    [prototypeVatPresetId],
  );

  const vatLookupStepLabels = useMemo(
    () => vatLookupSimulationStepsForPreset(activeVatPreset),
    [activeVatPreset],
  );

  const [companyLookupPhase, setCompanyLookupPhase] = useState<"idle" | "loading" | "ready">(
    readInitialCompanyLookupPhase,
  );
  const [lookupProgress, setLookupProgress] = useState(0);
  const [lookupStepIndex, setLookupStepIndex] = useState(-1);

  useEffect(() => {
    if (step !== "company") return;
    const preset = findVatPrototypePreset(prototypeVatPresetId) ?? VAT_PROTOTYPE_PRESETS[0];
    if (!preset) return;

    const timeoutIds: number[] = [];
    const scheduleLookup = (delayMs: number, fn: () => void) => {
      timeoutIds.push(window.setTimeout(fn, delayMs));
    };

    scheduleLookup(150, () => {
      setLookupProgress(12);
      setLookupStepIndex(0);
    });
    scheduleLookup(700, () => {
      setLookupProgress(30);
      setLookupStepIndex(1);
    });
    scheduleLookup(1300, () => {
      setLookupProgress(48);
      setLookupStepIndex(2);
    });
    scheduleLookup(1900, () => {
      setLookupProgress(64);
      setLookupStepIndex(3);
    });
    scheduleLookup(2500, () => {
      setLookupProgress(80);
      setLookupStepIndex(4);
    });
    scheduleLookup(3300, () => {
      setFlowState((prev) => {
        const baseContext = resolveFlowContext(
          prev.context as Partial<CustomerContext> & {
            representativeName?: string;
            kycNotes?: string;
            address?: string;
          },
        );
        const enriched = enrichRegistrationContext({
          vatNumber: baseContext.vatNumber,
          representativeEmail: baseContext.representativeEmail,
          preset,
          firmaCountryLocked: firmaCountryLabelLockedForOrigin(requestOrigin) != null,
        });
        const { hints, ...enrichedFields } = enriched;
        const mergedCore = resolveFlowContext({
          ...baseContext,
          ...enrichedFields,
        });
        const withPrototypeOptionals = resolveFlowContext(
          mergeCustomerContextDeep(
            mergedCore,
            prototypeOptionalDemoContextPatch(mergedCore, preset),
          ),
        );
        return {
          ...prev,
          companyFieldHints: hints,
          context: withPrototypeOptionals,
        };
      });
      setLookupProgress(100);
      setCompanyLookupPhase("ready");
    });

    return () => timeoutIds.forEach((id) => window.clearTimeout(id));
  }, [step, prototypeVatPresetId, requestOrigin, setFlowState]);

  useEffect(() => {
    if (step !== "company" || companyLookupPhase !== "ready") return;
    const locked = firmaCountryLabelLockedForOrigin(requestOrigin);
    if (!locked) return;
    const iso = registrationIsoCodeFromDutchCountryLabel(locked);
    setFlowState((prev) => {
      if (prev.context.country === locked && prev.context.addressCountryCode === iso) {
        return prev;
      }
      return {
        ...prev,
        context: resolveFlowContext({
          ...prev.context,
          country: locked,
          addressCountryCode: iso,
        }),
      };
    });
  }, [step, companyLookupPhase, requestOrigin, setFlowState]);

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

  const goToOnboardingStep = (nextStep: OnboardingStep) => {
    const targetIndex = stepIndex(nextStep);
    if (steps[targetIndex]?.available === false) {
      return;
    }
    if (nextStep === "company") {
      setCompanyLookupPhase("loading");
      setLookupProgress(0);
      setLookupStepIndex(-1);
    }
    if (nextStep === "request") {
      setFlowState((prev) => ({
        ...prev,
        step: nextStep,
        wizardInitialStep: prev.drafts.length > 0 ? "drafts" : "intent",
      }));
      return;
    }
    setFlowState((prev) => ({
      ...prev,
      step: nextStep,
      ...(nextStep === "company" ? { companyFieldHints: {} } : {}),
    }));
  };

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
  };

  const viewProps: AnonymousOnboardingFlowViewProps = {
    step,
    certificationPhaseTitle: CERTIFICATION_PHASE_TITLE,
    certificationPhaseDescription: CERTIFICATION_PHASE_DESCRIPTION,
    registrationPhaseTitle: REGISTRATION_PHASE_TITLE,
    registrationPhaseDescription: REGISTRATION_PHASE_DESCRIPTION,
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
