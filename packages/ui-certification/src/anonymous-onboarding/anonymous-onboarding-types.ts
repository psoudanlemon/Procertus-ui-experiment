import type { CertificationRequestDraft } from "../CertificationRequestContext";
import type { RegistrationEnrichmentHints } from "./lib/vatPrototypePresets";

export type CustomerContext = {
  representativeFirstName: string;
  representativeLastName: string;
  /** Preset id: none, mr, mrs, …, other */
  representativeTitlePreset: string;
  /** Effective title (from preset or free text / override) */
  representativeTitle: string;
  representativeEmail: string;
  /** Preset id for role; `other` means user must type `representativeRole` */
  representativeRolePreset: string;
  /** Required: label from preset or custom text */
  representativeRole: string;
  organizationName: string;
  country: string;
  vatNumber: string;
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
};

export const ONBOARDING_STEPS = ["request", "customer", "company", "review", "summary"] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type AnonymousOnboardingFlowState = {
  step: OnboardingStep;
  drafts: CertificationRequestDraft[];
  /** Draft ids included in the submission package on the summary step (all drafts stay listed; toggling updates the left overview only). */
  summaryIncludedDraftIds?: string[];
  context: CustomerContext;
  wizardInitialStep: "intent" | "drafts";
  /** Prototype: which canned VAT scenario is selected (production: free-text VAT only). */
  prototypeVatPresetId: string;
  /** Helper copy under company-step fields after mock enrichment; cleared when the user edits that field. */
  companyFieldHints: RegistrationEnrichmentHints;
};
