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
   * Legacy: enkelvoudige factuur‑rechtspersoon; wordt niet meer in de hoofd‑UI gebruikt maar blijft
   * gedecodeerd bij persistentie. Per aanvraag zie {@link invoicingMirrorCertificationLegalEntities}
   * en {@link invoicingInquiryVestigingId}.
   */
  invoicingDiffersFromHeadOffice: boolean;
  /** Legacy enkel veld bij {@link invoicingDiffersFromHeadOffice}. */
  invoicingVestigingId: string;
  /**
   * Wanneer true: facturatiedrukker per aanvraag volgt {@link certificationInquiryVestigingId}
   * (respectievelijk impliciet zetel wanneer {@link headOfficeIsCertificationLegalEntity} `"yes"`).
   */
  invoicingMirrorCertificationLegalEntities: boolean;
  /**
   * Bij {@link invoicingMirrorCertificationLegalEntities} false: aanvraag‑id → zetel‑sentinel of
   * vestigings‑id uit {@link onboardingVestigingen} (zelde semantics als certificatietabel).
   */
  invoicingInquiryVestigingId: Record<string, string>;
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

/** Mock-only bijlage voor het innovatie-attest uploadblok (geen echte blob‑opslag). */
export type InnovationAttestMockAttachment = {
  id: string;
  name: string;
  sizeLabel: string;
};

/** Innovatie-attest intake vastgelegd tijdens formele registratie (open tekst + mock uploads). */
export type InnovationAttestCapture = {
  productDescription: string;
  applications: string;
  regulatoryGapArgumentation: string;
  regulatedProductGroup: string;
  technicalDescription: string;
  deviatingCharacteristics: string;
  executionRequirements: string;
  clientName: string;
  clientAddress: string;
  projectName: string;
  projectAddress: string;
  clientContactName: string;
  clientContactPhone: string;
  clientContactEmail: string;
  projectDescription: string;
  requestedPerformance: string;
  unacceptableRisks: string;
  /** Bouwheer bevestigt dat projectgegevens in het dossier mogen worden opgenomen (verplicht om verder te gaan). */
  clientConsentAccepted: boolean;
  attachments: InnovationAttestMockAttachment[];
};

/**
 * Innovatie‑attest‑aanvraag in het dossierpakket: formulierinhoud + stap‑bevestiging (zoals
 * {@link companyZetelStepCompleted} elders op flow‑niveau, maar gegroepeerd bij deze inquiry).
 */
export type InnovationAttestInquiryState = {
  capture: InnovationAttestCapture;
  /** Na **Verder** van het innovatie‑attest blok (alleen relevant als het pakket die inquiry bevat). */
  stepCompleted: boolean;
};

/**
 * Canonical registration step ids (URL‑segmenten). Het innovatie‑attest wordt dynamisch uit de stepper
 * weggelaten wanneer het pakket geen innovatie‑aanvraag bevat (`registrationStepsSequence` in onboarding-registration-steps.ts).
 */
export const ONBOARDING_STEPS = [
  "origin",
  "customer",
  "company",
  "innovationAttest",
  "companyLegalEntities",
  "invoicing",
  "extras",
  "summary",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/**
 * Which guest-facing intake surface the user is on / last chose before committing to formal dossier
 * registration (`requestOrigin`). Formal registration sets this to `"formal"` when origin is chosen.
 */
export const GUEST_INTAKE_CHANNELS = ["", "formal", "informational", "expert-call"] as const;

export type GuestIntakeChannel = (typeof GUEST_INTAKE_CHANNELS)[number];

/**
 * Serializable snapshot of {@link ExpertCallBookingView} fields mirrored into {@link OnboardingFlowState}
 * so informal intake progress survives navigation within the guest shell.
 */
export type InformalIntakeCapture = {
  selectedDate: string | null;
  selectedSlot: string | null;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  phone: string;
  company: string;
  wantsExpertCall: boolean;
};

export type OnboardingFlowState = {
  /**
   * Wegwijzer-service id van het lopende traject. Gezet wanneer de aanvraag via TrajectConfigureFlow
   * start, leeg bij een schone state. Wordt gebruikt om de "Annuleren / Terug" knop in de customer
   * onboarding terug te koppelen aan de juiste TriagePage, ook na een refresh.
   */
  trajectServiceId: string;
  /** Guest intake branch for analytics / copy; `"formal"` once origin step commits. */
  guestIntakeChannel: GuestIntakeChannel;
  /** Service id for informational / expert-call flows when tied to a Wegwijzer entry. */
  informalIntakeServiceId?: string;
  /** Latest informal booking form snapshot (info-request / expert-call). */
  informalIntake?: InformalIntakeCapture;
  /**
   * Free-text note bundled with informational and/or formal submission when the informational
   * intake path (`/welcome/info-request/…`) has been opened — editable again on nazicht summary.
   */
  submissionNote?: string;
  /**
   * Set when the guest opens the informational-request page so the submission note applies to both
   * that flow and subsequent formal dossier nazicht until reset.
   */
  submissionNoteUnlocked?: boolean;
  /**
   * Wegwijzer toonlabel (bv. naam van het dienstkanaal uit de triage) voor kopie in de registratiefase.
   */
  registrationEntryLabel?: string;
  /**
   * Gezet op de triagekaart “Traject opstarten”; `false` bij informatieaanvraag of expert-call.
   * Bepaalt mee of het gast‑mandje en de voortgangbanner een lopend **formeel** dossier tonen
   * (samen met {@link requestOrigin} zodra de registratie is gestart).
   */
  formalRequestPackageCommitted: boolean;
  /** Where the requesting company is based; drives preset and country options for later steps. */
  requestOrigin: OnboardingRequestOrigin | "";
  drafts: CertificationRequestDraft[];
  /** Draft ids included in the submission package on the summary step (all drafts stay listed; toggling updates the left overview only). */
  summaryIncludedDraftIds?: string[];
  context: CustomerContext;
  /** Prototype: which canned VAT scenario is selected (production: free-text VAT only). */
  prototypeVatPresetId: string;
  /** Short hints under company fields after automatic prefill; cleared when the user edits that field. */
  companyFieldHints: RegistrationEnrichmentHints;
  /**
   * Per registered person: invite / onboarding in Klantenportaal on submit (`false` = opted out).
   * Omitted ids default to enabled (true).
   */
  summaryKlantenportaalByPersonId?: Record<string, boolean>;
  /**
   * Wordt `true` pas na “Verder” van de maatschappelijke‑zetelstap. De VAT‑lookup vult `context` al
   * vóór die bevestiging; zonder deze vlag zou resume ten onrechte latere stappen kiezen.
   */
  companyZetelStepCompleted: boolean;
  /** Innovatie-attest inquiry: inhoud plus stap-afgerond vlag (resume/stepper zoals andere registratiestappen). */
  innovationAttestInquiry: InnovationAttestInquiryState;
  /**
   * Na **Verder** van certificatie‑/juridische entiteit (zetel vs vestigingen per aanvraag).
   * Een keuze zoals “zetel voor alle aanvragen” kan `context` meteen valide maken zonder deze stap te verlaten.
   */
  companyLegalEntitiesStepCompleted: boolean;
  /** Na **Verder** van de facturatiestap (of stapoverslaan rechtstreeks naar nazicht via de stepper). */
  invoicingStepCompleted: boolean;
  /**
   * Na **Verder** van de stap met optionele contacten. Standaard is die inhoud vaak al “geldig” zonder invoer,
   * dus zonder vlag zou resume nazicht overslaan.
   */
  extrasStepCompleted: boolean;
};
