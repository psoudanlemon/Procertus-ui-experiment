"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { REGISTRATION_SUBMIT_REDIRECT_DELAY_MS } from "./lib/registrationSubmitSimulation";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  enrichRegistrationContext,
  findVatPrototypePreset,
  registrationIsoCodeFromDutchCountryLabel,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";
import {
  customerContextAfterPrototypePresetChange,
  effectiveIncludedCertificationDraftIds,
  isOnboardingInvoicingStepValid,
  mergeCustomerContextDeep,
  prototypeOptionalDemoContextPatch,
  readInitialCompanyLookupPhase,
  resolveFlowContext,
} from "./onboarding-flow-helpers";
import type { OnboardingFlowState, CustomerContext, OnboardingStep } from "./onboarding-types";
import { ONBOARDING_STEPS } from "./onboarding-types";
import { firmaCountryLabelLockedForOrigin, vatPrototypePresetIdsForOrigin } from "./onboarding-request-origin";
import {
  ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION,
  ONBOARDING_REGISTRATION_COMPLETE_PATH,
} from "./onboarding-constants";
import { hydrateOnboardingFlowStateFromStored } from "./onboarding-default-flow-state";
import type { OnboardingFlowPersistencePort } from "./persistence/onboarding-flow-persistence-port";
import {
  createOnboardingFlowApi,
  type OnboardingFlowApi,
} from "./onboarding-flow-api";

type LegacyContext = Partial<CustomerContext> & {
  representativeName?: string;
  kycNotes?: string;
  address?: string;
};

export type OnboardingFlowProviderProps = {
  children: ReactNode;
  persistence: OnboardingFlowPersistencePort;
  /** When set, registration submit simulation navigates here after the delay. */
  navigate?: (to: string, options?: { replace?: boolean }) => void;
  registrationCompletePath?: string;
};

type CompanyLookupUiState = {
  companyLookupPhase: "idle" | "loading" | "ready";
  lookupProgress: number;
  lookupStepIndex: number;
  setCompanyLookupPhase: Dispatch<SetStateAction<"idle" | "loading" | "ready">>;
  setLookupProgress: Dispatch<SetStateAction<number>>;
  setLookupStepIndex: Dispatch<SetStateAction<number>>;
};

type RegistrationSubmitUiState = {
  registrationSubmitOpen: boolean;
  setRegistrationSubmitOpen: Dispatch<SetStateAction<boolean>>;
  registrationProgress: number;
  setRegistrationProgress: Dispatch<SetStateAction<number>>;
  registrationStepIndex: number;
  setRegistrationStepIndex: Dispatch<SetStateAction<number>>;
};

export type OnboardingFlowContextValue = {
  persistence: OnboardingFlowPersistencePort;
  flowState: OnboardingFlowState;
  setFlowState: Dispatch<SetStateAction<OnboardingFlowState>>;
  api: OnboardingFlowApi;
  resolvedContext: CustomerContext;
} & CompanyLookupUiState &
  RegistrationSubmitUiState;

const OnboardingFlowContext = createContext<OnboardingFlowContextValue | null>(
  null,
);

export function OnboardingFlowProvider({
  children,
  persistence,
  navigate,
  registrationCompletePath,
}: OnboardingFlowProviderProps) {
  const [flowState, setFlowState] = useState<OnboardingFlowState>(() =>
    hydrateOnboardingFlowStateFromStored(persistence.load()),
  );

  const [companyLookupPhase, setCompanyLookupPhase] = useState<"idle" | "loading" | "ready">(
    readInitialCompanyLookupPhase,
  );
  const [lookupProgress, setLookupProgress] = useState(0);
  const [lookupStepIndex, setLookupStepIndex] = useState(-1);

  const [registrationSubmitOpen, setRegistrationSubmitOpen] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState(0);
  const [registrationStepIndex, setRegistrationStepIndex] = useState(-1);

  const api = useMemo(() => createOnboardingFlowApi(setFlowState), []);

  useEffect(() => {
    persistence.save(flowState);
  }, [flowState, persistence]);

  const resolvedContext = useMemo(
    () => resolveFlowContext(flowState.context as LegacyContext),
    [flowState.context],
  );

  const { step, requestOrigin, prototypeVatPresetId } = flowState;

  /** Entering company step always restarts mock lookup UI. */
  useEffect(() => {
    if (step !== "company") return;
    setCompanyLookupPhase("loading");
    setLookupProgress(0);
    setLookupStepIndex(-1);
  }, [step]);

  /** Normalize context from storage (legacy steps, missing keys, …). */
  useEffect(() => {
    setFlowState((prev) => {
      const fixes: Partial<OnboardingFlowState> = {};
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
            resumeStep === "companyLegalEntities" ||
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
      const invoicingIncludedDraftIds = effectiveIncludedCertificationDraftIds(
        prev.drafts,
        prev.summaryIncludedDraftIds,
      );
      if (
        !ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION &&
        (candidateStep === "extras" || candidateStep === "summary") &&
        !isOnboardingInvoicingStepValid(nextContext, invoicingIncludedDraftIds)
      ) {
        fixes.step = "invoicing";
      }
      if (JSON.stringify(nextContext) !== JSON.stringify(prev.context)) {
        fixes.context = nextContext;
      }
      return Object.keys(fixes).length === 0 ? prev : { ...prev, ...fixes };
    });
  }, []);

  /** Clamp VAT preset when request origin excludes current preset id. */
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
  }, [requestOrigin, prototypeVatPresetId]);

  /** Mock company enrichment while on company step. */
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
  }, [step, prototypeVatPresetId, requestOrigin]);

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
  }, [step, companyLookupPhase, requestOrigin]);

  const registrationDestination = registrationCompletePath ?? ONBOARDING_REGISTRATION_COMPLETE_PATH;

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
      if (!cancelled && navigate) {
        navigate(registrationDestination);
      }
    });
    return () => {
      cancelled = true;
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [registrationSubmitOpen, navigate, registrationDestination]);

  const value = useMemo(
    (): OnboardingFlowContextValue => ({
      persistence,
      flowState,
      setFlowState,
      api,
      resolvedContext,
      companyLookupPhase,
      setCompanyLookupPhase,
      lookupProgress,
      setLookupProgress,
      lookupStepIndex,
      setLookupStepIndex,
      registrationSubmitOpen,
      setRegistrationSubmitOpen,
      registrationProgress,
      setRegistrationProgress,
      registrationStepIndex,
      setRegistrationStepIndex,
    }),
    [
      persistence,
      flowState,
      api,
      resolvedContext,
      companyLookupPhase,
      lookupProgress,
      lookupStepIndex,
      registrationSubmitOpen,
      registrationProgress,
      registrationStepIndex,
    ],
  );

  return (
    <OnboardingFlowContext.Provider value={value}>
      {children}
    </OnboardingFlowContext.Provider>
  );
}

export function useOnboardingFlowContext(): OnboardingFlowContextValue {
  const ctx = useContext(OnboardingFlowContext);
  if (!ctx) {
    throw new Error("useOnboardingFlowContext requires OnboardingFlowProvider");
  }
  return ctx;
}

export function useOnboardingFlowApi(): OnboardingFlowApi {
  return useOnboardingFlowContext().api;
}

export function useOnboardingFlowState(): {
  flowState: OnboardingFlowState;
  setFlowState: Dispatch<SetStateAction<OnboardingFlowState>>;
  resolvedContext: CustomerContext;
} {
  const { flowState, setFlowState, resolvedContext } = useOnboardingFlowContext();
  return { flowState, setFlowState, resolvedContext };
}

export function useOnboardingCompanyLookupUi(): Pick<
  OnboardingFlowContextValue,
  | "companyLookupPhase"
  | "lookupProgress"
  | "lookupStepIndex"
  | "setCompanyLookupPhase"
  | "setLookupProgress"
  | "setLookupStepIndex"
> {
  const v = useOnboardingFlowContext();
  return {
    companyLookupPhase: v.companyLookupPhase,
    lookupProgress: v.lookupProgress,
    lookupStepIndex: v.lookupStepIndex,
    setCompanyLookupPhase: v.setCompanyLookupPhase,
    setLookupProgress: v.setLookupProgress,
    setLookupStepIndex: v.setLookupStepIndex,
  };
}

export function useOnboardingRegistrationSubmitUi(): Pick<
  OnboardingFlowContextValue,
  | "registrationSubmitOpen"
  | "setRegistrationSubmitOpen"
  | "registrationProgress"
  | "setRegistrationProgress"
  | "registrationStepIndex"
  | "setRegistrationStepIndex"
> {
  const v = useOnboardingFlowContext();
  return {
    registrationSubmitOpen: v.registrationSubmitOpen,
    setRegistrationSubmitOpen: v.setRegistrationSubmitOpen,
    registrationProgress: v.registrationProgress,
    setRegistrationProgress: v.setRegistrationProgress,
    registrationStepIndex: v.registrationStepIndex,
    setRegistrationStepIndex: v.setRegistrationStepIndex,
  };
}
