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
  REGISTRATION_COUNTRY_OPTIONS,
  vatLookupSimulationStepsForPreset,
  companyFormFieldsPrefilledByMockLookup,
  companyFormFieldsResolvedThroughLookupStep,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";
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
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
  REGISTRATION_PHASE_DESCRIPTION,
  REGISTRATION_PHASE_TITLE,
} from "./anonymous-onboarding-constants";
import {
  buildRows,
  formatRequesterStepperLabel,
  hasStructuredPostalAddress,
  onboardingReviewRequesterFromContext,
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
  drafts: [],
  summaryIncludedDraftIds: [],
  context: DEFAULT_CONTEXT,
  wizardInitialStep: "intent",
  prototypeVatPresetId: DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  companyFieldHints: {},
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
    const c = context.country?.trim();
    if (c && !REGISTRATION_COUNTRY_OPTIONS.includes(c)) {
      return [...REGISTRATION_COUNTRY_OPTIONS, c].sort((a, b) => a.localeCompare(b, "nl"));
    }
    return REGISTRATION_COUNTRY_OPTIONS;
  }, [context.country]);

  const countrySelectValue = useMemo(() => {
    const t = context.country?.trim() ?? "";
    return t && countrySelectOptions.includes(t) ? t : COUNTRY_SELECT_NONE;
  }, [context.country, countrySelectOptions]);

  const activeStep = stepIndex(step);
  const hasDrafts = drafts.length > 0;
  const hasCustomerContext =
    (context.representativeFirstName?.trim() ?? "").length > 0 &&
    (context.representativeLastName?.trim() ?? "").length > 0 &&
    (context.representativeEmail?.trim() ?? "").length > 0 &&
    (context.representativeRole?.trim() ?? "").length > 0 &&
    isVatIdentifierPlausible(context.vatNumber ?? "");
  const hasCompanyContext =
    (context.organizationName?.trim() ?? "").length > 0 &&
    (context.country?.trim() ?? "").length > 0 &&
    hasStructuredPostalAddress(context);
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
        id: "customer",
        title: "Registratie",
        description: formatRequesterStepperLabel(context),
        available: hasDrafts,
      },
      {
        id: "company",
        title: "Bedrijfsgegevens",
        description: context.organizationName || "Uit BTW-nummer",
        available: hasDrafts && hasCustomerContext,
      },
      {
        id: "summary",
        title: "Versturen",
        description: "Annvraag controleren",
        available: hasDrafts && hasCustomerContext && hasCompanyContext,
      },
    ],
    [context, drafts.length, hasCompanyContext, hasCustomerContext, hasDrafts, step],
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

  /** Normalize context from storage (missing keys, legacy `representativeName`, step/preset fixes). */
  useEffect(() => {
    setFlowState((prev) => {
      const fixes: Partial<AnonymousOnboardingFlowState> = {};
      let migratedStep = prev.step;
      if ((migratedStep as string) === "kyc") migratedStep = "company";
      if ((migratedStep as string) === "profile") migratedStep = "summary";
      if ((migratedStep as string) === "activation") migratedStep = "summary";
      if (!ONBOARDING_STEPS.includes(migratedStep)) migratedStep = "request";
      if (migratedStep !== prev.step) {
        fixes.step = migratedStep;
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
        });
        const { hints, ...enrichedFields } = enriched;
        return {
          ...prev,
          companyFieldHints: hints,
          context: resolveFlowContext({
            ...baseContext,
            ...enrichedFields,
          }),
        };
      });
      setLookupProgress(100);
      setCompanyLookupPhase("ready");
    });

    return () => timeoutIds.forEach((id) => window.clearTimeout(id));
  }, [step, prototypeVatPresetId, setFlowState]);

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
    step === "customer"
      ? {
          label: "Verder",
          onClick: () => goToOnboardingStep("company"),
          disabled: !hasCustomerContext,
        }
      : step === "company"
        ? {
            label: "Verder",
            onClick: () => setFlowState((prev) => ({ ...prev, step: "summary" })),
            disabled: !hasCompanyContext || companyLookupPhase !== "ready",
          }
        : step === "summary"
          ? {
              label: "Versturen",
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
          step: "customer",
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
    setFlowState,
    drafts,
    effectiveSummaryIncludedDraftIds,
    rows: buildRows(context, drafts, effectiveSummaryIncludedDraftIds),
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
    countrySelectOptions,
    countrySelectValue,
    companyHints,
  };

  return {
    redirectToRegistrationComplete: !!registrationCompleteRedirect,
    viewProps,
  };
}
