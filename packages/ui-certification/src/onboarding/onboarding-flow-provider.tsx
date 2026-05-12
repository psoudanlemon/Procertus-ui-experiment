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
  findVatPrototypePreset,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";
import {
  customerContextAfterPrototypePresetChange,
  readInitialCompanyLookupPhase,
  resolveFlowContext,
} from "./onboarding-flow-helpers";
import type { OnboardingFlowState, CustomerContext } from "./onboarding-types";
import { vatPrototypePresetIdsForOrigin } from "./onboarding-request-origin";
import { ONBOARDING_REGISTRATION_COMPLETE_PATH } from "./onboarding-constants";
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

  const { requestOrigin, prototypeVatPresetId } = flowState;

  /** Normalize context from storage (legacy keys, missing fields). */
  useEffect(() => {
    setFlowState((prev) => {
      const fixes: Partial<OnboardingFlowState> = {};
      if (prev.requestOrigin === undefined) {
        fixes.requestOrigin = "";
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
      if (prev.guestIntakeChannel === undefined) {
        fixes.guestIntakeChannel = "";
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
