import type { DownloadableItemData } from "@procertus-ui/ui";
import type {
  InnovationAttestCapture,
  InnovationAttestInquiryState,
  InnovationAttestMockAttachment,
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

/** Rijen voor nazicht-tabellen: alleen velden met ingevoerde inhoud (zelfde volgorde als de stap). */
export function innovationAttestCaptureSummaryRows(
  capture: InnovationAttestCapture,
): readonly { id: string; label: string; value: string }[] {
  const rows: { id: string; label: string; value: string }[] = [];
  const push = (id: string, label: string, raw: string) => {
    const v = raw.trim();
    if (v.length > 0) rows.push({ id, label, value: v });
  };

  push("productDescription", "Productbeschrijving", capture.productDescription);
  push("applications", "Toepassingen", capture.applications);
  push(
    "regulatoryGapArgumentation",
    "Motivering buiten bestaande voorschriften",
    capture.regulatoryGapArgumentation,
  );
  push("regulatedProductGroup", "Gereglementeerde productgroep", capture.regulatedProductGroup);
  push("technicalDescription", "Technische beschrijving", capture.technicalDescription);
  push("deviatingCharacteristics", "Afwijkende kenmerken", capture.deviatingCharacteristics);
  push("executionRequirements", "Uitvoering en nabehandeling", capture.executionRequirements);
  push("clientName", "Bouwheer", capture.clientName);
  push("clientAddress", "Adres bouwheer", capture.clientAddress);
  push("projectName", "Projectnaam", capture.projectName);
  push("projectAddress", "Projectadres", capture.projectAddress);
  push("clientContactName", "Contactpersoon bouwheer", capture.clientContactName);
  push("clientContactPhone", "Telefoon", capture.clientContactPhone);
  push("clientContactEmail", "E-mail", capture.clientContactEmail);
  push("projectDescription", "Projectbeschrijving", capture.projectDescription);
  push("requestedPerformance", "Gevraagde prestaties", capture.requestedPerformance);
  push("unacceptableRisks", "Ontoelaatbare risico's", capture.unacceptableRisks);

  if (capture.clientConsentAccepted) {
    rows.push({
      id: "clientConsentAccepted",
      label: "Akkoord bouwheer",
      value: "Ja",
    });
  }

  return rows;
}

/**
 * Mapt mock-bijlagen naar downloadkaarten (`href` is een ankerplaatshouder; geen echte blob-URL).
 */
export function innovationAttestAttachmentsAsDownloadableItems(
  attachments: readonly InnovationAttestMockAttachment[],
): DownloadableItemData[] {
  return attachments.map((a) => ({
    id: a.id,
    title: a.name,
    formatHint: a.sizeLabel,
    description: "Tijdelijk toegevoegd tijdens het invullen van het innovatie-attest.",
    href: `#onboarding-innovation-attest-attachment-${a.id}`,
  }));
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
