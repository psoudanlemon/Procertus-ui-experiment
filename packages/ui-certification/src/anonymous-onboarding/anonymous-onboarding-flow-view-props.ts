import type { OnboardingStepperStep, StepLayoutAction } from "@procertus-ui/ui-lib";
import type { Dispatch, SetStateAction } from "react";

import type { CertificationRequestDraft } from "../CertificationRequestContext";
import type { CertificationRequestWizardProps } from "../components/certification-request-wizard/CertificationRequestWizard";
import type { RegistrationProcessingStep } from "../components/registration-processing-dialog";
import type { RequestPackageRow } from "../components/request-package-review";
import type {
  AnonymousOnboardingFlowState,
  CustomerContext,
  OnboardingStep,
} from "./anonymous-onboarding-types";
import type {
  CompanyFormFieldKey,
  RegistrationEnrichmentHints,
  VatPrototypePreset,
} from "./lib/vatPrototypePresets";

export type AnonymousOnboardingFlowViewProps = {
  step: OnboardingStep;
  certificationPhaseTitle: string;
  certificationPhaseDescription: string;
  registrationPhaseTitle: string;
  registrationPhaseDescription: string;
  onSignInClick: () => void;
  certificationWizardProps: CertificationRequestWizardProps;
  registrationSubmitOpen: boolean;
  onRegistrationSubmitOpenChange: (open: boolean) => void;
  registrationProgress: number;
  registrationStepIndex: number;
  registrationSimulationLabels: readonly RegistrationProcessingStep[];
  context: CustomerContext;
  updateContext: (id: keyof CustomerContext, value: string) => void;
  setFlowState: Dispatch<SetStateAction<AnonymousOnboardingFlowState>>;
  drafts: CertificationRequestDraft[];
  effectiveSummaryIncludedDraftIds: readonly string[];
  rows: RequestPackageRow[];
  steps: OnboardingStepperStep[];
  activeStep: number;
  goToOnboardingStep: (nextStep: OnboardingStep) => void;
  primaryAction: StepLayoutAction;
  backAction: StepLayoutAction;
  cancelAction?: StepLayoutAction;
  companyLookupPhase: "idle" | "loading" | "ready";
  lookupProgress: number;
  lookupStepIndex: number;
  vatLookupStepLabels: readonly { id: string; label: string }[];
  companyPrefillFieldKeys: ReadonlySet<CompanyFormFieldKey>;
  companyFieldsResolvedInSimulation: ReadonlySet<CompanyFormFieldKey>;
  vatNumberForDisplay: string;
  emailForDisplay: string;
  activeVatPreset: VatPrototypePreset | undefined;
  prototypeVatPresetId: string;
  countrySelectOptions: readonly string[];
  countrySelectValue: string;
  companyHints: RegistrationEnrichmentHints;
};
