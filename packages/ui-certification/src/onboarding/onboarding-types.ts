import type { CertificationRequestDraft } from "../CertificationRequestContext";
import type { IdentificatiePersonSubformValue } from "@procertus-ui/domain-certification";
import type { RegistrationEnrichmentHints } from "./lib/vatPrototypePresets";
import type { OnboardingRequestOrigin } from "./onboarding-request-origin";

export type IdentificatiePersonCaptureState = IdentificatiePersonSubformValue;

/** Canonical person entry for the onboarding session (deduped by e-mail). Referenced from optional slots. */
export type OnboardingRegisteredPerson = {
  id: string;
  /** Shown in pickers, e.g. bron van de gegevens */
  sourceLabel?: string;
  person: IdentificatiePersonCaptureState;
};

/** Whether the person completing registration is the legal representative named below; empty until answered. */
export type ApplicantLegalRepresentativeAnswer = "" | "yes" | "no";

export type CertificationLegalEntityAnswer = "" | "yes" | "no";

/**
 * Operational site / establishment for certification when it is not the head office (maatschappelijke zetel).
 * No VAT: one organisation number applies; this is extra legal name and address only.
 */
export type OnboardingVestiging = {
  id: string;
  legalName: string;
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
  country: string;
  addressCountryCode: string;
};

export type CustomerContext = {
  representativeFirstName: string;
  representativeLastName: string;
  /** Preset id: none, mr, mrs, …, other */
  representativeTitlePreset: string;
  /** Effective title (from preset or free text / override) */
  representativeTitle: string;
  representativeEmail: string;
  /** Preset id for role; `none` = geen selectie; `other` = vrije tekst in `representativeRole`. */
  representativeRolePreset: string;
  /** Label from preset, custom text when preset is `other`, or empty when `none`. */
  representativeRole: string;
  /**
   * Is the person completing this form the same as the legal representative whose details are
   * entered below? Required on the registratie step before continuing.
   */
  applicantIsLegalRepresentative: ApplicantLegalRepresentativeAnswer;
  /**
   * Person completing the registration when {@link applicantIsLegalRepresentative} is `"no"`.
   * Ignored when the applicant is the legal representative.
   */
  registrantPerson: IdentificatiePersonCaptureState;
  /** Same semantics as {@link representativeTitlePreset} for the registrant (indiener). */
  registrantTitlePreset: string;
  /** Effective title for the registrant (preset label, free text when `other`, or empty when `none`). */
  registrantTitle: string;
  /** Same semantics as {@link representativeRolePreset} for the registrant. */
  registrantRolePreset: string;
  /** Same semantics as {@link representativeRole} for the registrant. */
  registrantRole: string;
  /** Main organisation phone (head office). */
  firmaPhone: string;
  /** Legal representative direct phone (optional). */
  legalRepresentativePhone: string;
  organizationName: string;
  country: string;
  vatNumber: string;
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
  addressCountryCode: string;

  /**
   * When true, the user assigns a dedicated contact for certification and inspection (independent
   * of the invoicing contact).
   */
  addCertificationContactOverride: boolean;
  certificationContact: IdentificatiePersonCaptureState;
  certificationContactTitlePreset: string;
  certificationContactTitle: string;
  certificationContactRolePreset: string;
  certificationContactRole: string;

  /** Optional second recipient for certification and inspection correspondence. */
  addCertificationSecondaryContact: boolean;
  certificationSecondary: IdentificatiePersonCaptureState;
  certificationSecondaryTitlePreset: string;
  certificationSecondaryTitle: string;
  certificationSecondaryRolePreset: string;
  certificationSecondaryRole: string;

  /**
   * Legacy: removed from UI; kept for persisted flow state compatibility (always cleared on load).
   */
  addInvoicingSupplementaryDetails: boolean;
  invoicingContactOrDepartment: string;
  /** When true, capture full person details for billing in addition to the short label. */
  invoicingUseContactPerson: boolean;
  invoicingContactPerson: IdentificatiePersonCaptureState;
  /**
   * Registry id of an existing {@link onboardingRegisteredPersons} row, or
   * {@link ONBOARDING_PERSON_NEW_ID} to enter a new person in the form.
   */
  invoicingContactPersonRegistryId: string;
  invoicingEmail: string;
  /**
   * When true, juridisch facturatiedrukker is a {@link onboardingVestigingen} entry, not de
   * maatschappelijke zetel. Nieuwe vestigingen komen ook op de bedrijfsstap terecht (zelfde lijst).
   */
  invoicingDiffersFromHeadOffice: boolean;
  /** Gekozen vestigings-id uit {@link onboardingVestigingen} wanneer {@link invoicingDiffersFromHeadOffice}. */
  invoicingVestigingId: string;
  /** Billing address when different from the main organisation address. */
  addInvoicingAddressOverride: boolean;
  invoicingAddressStreet: string;
  invoicingAddressHouseNumber: string;
  invoicingAddressPostalCode: string;
  invoicingAddressCity: string;
  invoicingCountry: string;
  invoicingAddressCountryCode: string;

  /**
   * Persons collected during onboarding (wettelijk vertegenwoordiger, indiener, optionele contacten).
   * Slots may reference rows by id; identity updates propagate here when a slot is linked.
   */
  onboardingRegisteredPersons: OnboardingRegisteredPerson[];
  /**
   * Vestigingen registered when certifications do not legally run via the maatschappelijke zetel alone.
   * No extra VAT/BTW-number; legal name + address only.
   */
  onboardingVestigingen: OnboardingVestiging[];
  /**
   * Draft id ({@link CertificationRequestDraft}) → vestiging id from {@link onboardingVestigingen}.
   * Same vestiging may be chosen for multiple certification inquiries (hergebruik).
   */
  certificationInquiryVestigingId: Record<string, string>;
  /** When true, certifications use maatschappelijke zetel as legal contracting entity without extra vestigingen. */
  headOfficeIsCertificationLegalEntity: CertificationLegalEntityAnswer;
  /**
   * When {@link addCertificationContactOverride} and linked to registry; otherwise
   * {@link ONBOARDING_PERSON_NEW_ID}.
   */
  certificationContactPersonRegistryId: string;
  /**
   * When {@link addCertificationSecondaryContact} and linked; otherwise
   * {@link ONBOARDING_PERSON_NEW_ID}.
   */
  certificationSecondaryPersonRegistryId: string;
};

/** Ordered wizard steps aligned with {@link OnboardingFlowView} and the registration stepper. */
export const ONBOARDING_STEPS = [
  "request",
  "origin",
  "customer",
  "company",
  "invoicing",
  "extras",
  "summary",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type OnboardingFlowState = {
  step: OnboardingStep;
  /**
   * Wegwijzer-service id van het lopende traject. Gezet wanneer de aanvraag via TrajectConfigureFlow
   * start, leeg bij een schone state. Wordt gebruikt om de "Annuleren / Terug" knop in de customer
   * onboarding terug te koppelen aan de juiste TriagePage, ook na een refresh.
   */
  trajectServiceId: string;
  /**
   * Wegwijzer toonlabel (bv. naam van het dienstkanaal uit de triage) voor kopie in de registratiefase.
   */
  registrationEntryLabel?: string;
  /** Where the requesting company is based; drives preset and country options for later steps. */
  requestOrigin: OnboardingRequestOrigin | "";
  drafts: CertificationRequestDraft[];
  /** Draft ids included in the submission package on the summary step (all drafts stay listed; toggling updates the left overview only). */
  summaryIncludedDraftIds?: string[];
  context: CustomerContext;
  wizardInitialStep: "intent" | "drafts";
  /** Prototype: which canned VAT scenario is selected (production: free-text VAT only). */
  prototypeVatPresetId: string;
  /** Short hints under company fields after automatic prefill; cleared when the user edits that field. */
  companyFieldHints: RegistrationEnrichmentHints;
  /**
   * Per registered person: invite / onboarding in Klantenportaal on submit (`false` = opted out).
   * Omitted ids default to enabled (true).
   */
  summaryKlantenportaalByPersonId?: Record<string, boolean>;
};
