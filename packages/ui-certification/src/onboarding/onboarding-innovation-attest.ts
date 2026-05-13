import type {
  InnovationAttestCapture,
  InnovationAttestInquiryState,
} from "./onboarding-types";

export function createEmptyInnovationAttestCapture(): InnovationAttestCapture {
  return {
    productDescription: "",
    applications: "",
    regulatoryGapArgumentation: "",
    regulatedProductGroup: "",
    technicalDescription: "",
    deviatingCharacteristics: "",
    executionRequirements: "",
    clientName: "",
    clientAddress: "",
    projectName: "",
    projectAddress: "",
    clientContactName: "",
    clientContactPhone: "",
    clientContactEmail: "",
    projectDescription: "",
    requestedPerformance: "",
    unacceptableRisks: "",
    clientConsentAccepted: false,
    attachments: [],
  };
}

type LegacyInnovationAttestCapturePartial = Partial<InnovationAttestCapture> & {
  /** Vervangen door {@link InnovationAttestCapture.clientConsentAccepted}; alleen voor hydratie. */
  clientConsent?: string;
};

/**
 * Minimum set shown as verplicht in de UI en geëist voor **Verder** / resume (overige velden zijn
 * optioneel in deze prototype-flow).
 */
export const INNOVATION_ATTEST_REQUIRED_CAPTURE_FIELD_KEYS = [
  "productDescription",
  "applications",
  "regulatoryGapArgumentation",
  "clientName",
  "projectName",
  "clientContactEmail",
] as const satisfies readonly (keyof InnovationAttestCapture)[];

export type InnovationAttestRequiredCaptureFieldKey =
  (typeof INNOVATION_ATTEST_REQUIRED_CAPTURE_FIELD_KEYS)[number];

/**
 * True when alle {@link INNOVATION_ATTEST_REQUIRED_CAPTURE_FIELD_KEYS} niet-leeg zijn (trim) en
 * akkoord is aangevinkt. Altijd strikt gehandhaafd (los van prototype-relaxed validatie op andere
 * registratiestappen), zodat Verder pas werkt na een geldig innovatie-attestblok.
 */
export function isInnovationAttestCaptureComplete(capture: InnovationAttestCapture): boolean {
  const stringsOk = INNOVATION_ATTEST_REQUIRED_CAPTURE_FIELD_KEYS.every(
    (key) => capture[key].trim().length > 0,
  );
  return stringsOk && capture.clientConsentAccepted === true;
}

/** Alleen voor prototype/demo: vult de verplichte sleutels met consistente fictieve inhoud. */
export function innovationAttestPrototypeRequiredFieldPreset(): Pick<
  InnovationAttestCapture,
  InnovationAttestRequiredCaptureFieldKey | "clientConsentAccepted"
> {
  return {
    productDescription:
      "Innovatief gevelpaneelsysteem met geïntegreerde regendichtheid en een brandwerende kern voor hoogbouw (demo-inhoud).",
    applications:
      "Buitenschil van kantoor- en gemengde gebouwen; windbelasting en onderhoudsscenario worden in het dossier verder gespecificeerd.",
    regulatoryGapArgumentation:
      "Geen bestaande harmonische norm dekt deze sandwich-opbouw met de gevraagde brandreactie en dikte in één erkend productcertificaat voor deze toepassing.",
    clientName: "Demo Bouwheer NV",
    projectName: "Innovatiegebouw Noord (prototype)",
    clientContactEmail: "aanvragen.demo@prototype-client.example",
    clientConsentAccepted: true,
  };
}

export function normalizeInnovationAttestCapture(
  partial: Partial<InnovationAttestCapture> | undefined,
): InnovationAttestCapture {
  const legacy = partial as LegacyInnovationAttestCapturePartial | undefined;
  const clientConsentAccepted =
    typeof partial?.clientConsentAccepted === "boolean"
      ? partial.clientConsentAccepted
      : typeof legacy?.clientConsent === "string" && legacy.clientConsent.trim().length > 0;

  return {
    ...createEmptyInnovationAttestCapture(),
    ...partial,
    clientConsentAccepted,
    attachments: Array.isArray(partial?.attachments) ? partial.attachments : [],
  };
}

export function createEmptyInnovationAttestInquiry(): InnovationAttestInquiryState {
  return {
    capture: createEmptyInnovationAttestCapture(),
    stepCompleted: false,
  };
}

export function normalizeInnovationAttestInquiry(
  partial: Partial<InnovationAttestInquiryState> | undefined,
): InnovationAttestInquiryState {
  return {
    capture: normalizeInnovationAttestCapture(partial?.capture),
    stepCompleted: typeof partial?.stepCompleted === "boolean" ? partial.stepCompleted : false,
  };
}

/** Strict resume/stepper: inquiry stap geldt als afgerond voor dit pakket. */
export function isInnovationAttestInquiryResumeOk(
  inquiry: InnovationAttestInquiryState,
  needsInnovationAttest: boolean,
): boolean {
  return (
    !needsInnovationAttest ||
    (isInnovationAttestCaptureComplete(inquiry.capture) && inquiry.stepCompleted)
  );
}
