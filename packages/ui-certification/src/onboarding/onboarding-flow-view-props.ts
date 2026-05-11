import type { StepLayoutAction, StepLayoutStep } from "@procertus-ui/ui";
import type { Dispatch, SetStateAction } from "react";

import type { CertificationRequestDraft } from "../CertificationRequestContext";
import type { CertificationRequestWizardProps } from "../components/certification-request-wizard/CertificationRequestWizard";
import type { RegistrationProcessingStep } from "../components/registration-processing-dialog";
import type { RequestPackageRow } from "../components/request-package-review";
import type { OnboardingFlowState, CustomerContext, OnboardingStep } from "./onboarding-types";
import type { RegistrationStepChromeCopy } from "./onboarding-registration-chrome-copy";
import type {
  CompanyFormFieldKey,
  RegistrationEnrichmentHints,
  VatPrototypePreset,
} from "./lib/vatPrototypePresets";
import type { OnboardingRequestOrigin } from "./onboarding-request-origin";

type RegistryHeaderLanguageProps = Pick<
  PublicRegistryHeaderProps,
  "languages" | "activeLanguage" | "onLanguageChange"
>;

export type OnboardingFlowViewProps = {
  step: OnboardingStep;
  certificationPhaseTitle: string;
  certificationPhaseDescription: string;
  registrationPhaseTitle: string;
  registrationPhaseDescription: string;
  onSignInClick: () => void;
  /** Guest login `<a href>` — pair with {@link onSignInClick} for in-app routing. */
  signInUrl?: string;
  certificationWizardProps: CertificationRequestWizardProps;
  registrationSubmitOpen: boolean;
  onRegistrationSubmitOpenChange: (open: boolean) => void;
  registrationProgress: number;
  registrationStepIndex: number;
  registrationSimulationLabels: readonly RegistrationProcessingStep[];
  context: CustomerContext;
  updateContext: (id: keyof CustomerContext, value: string) => void;
  patchContext: (patch: Partial<CustomerContext>) => void;
  setFlowState: Dispatch<SetStateAction<OnboardingFlowState>>;
  drafts: CertificationRequestDraft[];
  effectiveSummaryIncludedDraftIds: readonly string[];
  rows: RequestPackageRow[];
  steps: StepLayoutStep[];
  activeStep: number;
  goToOnboardingStep: (nextStep: OnboardingStep) => void;
  primaryAction: StepLayoutAction;
  backAction?: StepLayoutAction;
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
  vatPrototypePresetChoices: readonly VatPrototypePreset[];
  requestOrigin: OnboardingRequestOrigin | "";
  setRequestOrigin: (origin: OnboardingRequestOrigin) => void;
  countrySelectOptions: readonly string[];
  countrySelectValue: string;
  companyHints: RegistrationEnrichmentHints;
  /** Nazicht: Klantenportaal onboarding per registered person id (`false` = opt-out; omitted = on). */
  summaryKlantenportaalByPersonId: Record<string, boolean>;
  /** Leading public registry header slot (e.g. color mode). */
  registryHeaderLeadingActions?: ReactNode;
  /** Trailing header slot (e.g. inquiry cart). */
  registryHeaderTrailingActions?: ReactNode;
  /** Guest registry header language switcher (prototype). */
  languages?: RegistryHeaderLanguageProps["languages"];
  activeLanguage?: RegistryHeaderLanguageProps["activeLanguage"];
  onLanguageChange?: RegistryHeaderLanguageProps["onLanguageChange"];
  /** Guest language control placement for {@link PublicRegistryHeaderProps}. */
  guestLanguagePlacement?: PublicRegistryHeaderProps["guestLanguagePlacement"];
  /** Optional StepLayout title/description overrides per registration step (i18n). */
  registrationChromeOverrides?: Partial<
    Record<Exclude<OnboardingStep, "request">, Partial<RegistrationStepChromeCopy>>
  >;
  /**
   * Hide the leading "request" step from the stepper UI. Use this when the certification
   * request was configured upstream (e.g. in a separate TrajectConfigureFlow) and the view
   * only needs to expose the registration phase. Underlying step state stays intact.
   */
  hideRequestStep?: boolean;
};
