import type { DownloadableItemData } from "@procertus-ui/ui";

import type {
  InnovationAttestMockAttachment,
  MetrologyCapture,
  MetrologyInquiryState,
} from "./onboarding-types";

export function createEmptyMetrologyCapture(): MetrologyCapture {
  return {
    laboratoryContext: "",
    equipmentAndCalibrationNeeds: "",
    standardsReferenced: "",
    interventionSiteAddress: "",
    interventionRegionNotes: "",
    visitPreferenceNotes: "",
    technicalContactName: "",
    technicalContactPhone: "",
    technicalContactEmail: "",
    supplementaryNotes: "",
    requesterConsentAccepted: false,
    attachments: [],
  };
}

/** Verplichte velden voor deze prototype-flow — zie {@link isMetrologyCaptureComplete}. */
export const METROLOGY_REQUIRED_CAPTURE_FIELD_KEYS = [
  "equipmentAndCalibrationNeeds",
  "interventionSiteAddress",
  "technicalContactEmail",
] as const satisfies readonly (keyof MetrologyCapture)[];

export type MetrologyRequiredCaptureFieldKey =
  (typeof METROLOGY_REQUIRED_CAPTURE_FIELD_KEYS)[number];

export function isMetrologyCaptureComplete(capture: MetrologyCapture): boolean {
  const stringsOk = METROLOGY_REQUIRED_CAPTURE_FIELD_KEYS.every(
    (key) => typeof capture[key] === "string" && capture[key].trim().length > 0,
  );
  return stringsOk && capture.requesterConsentAccepted === true;
}

/** Alleen prototype/demo — vult de verplichte sleutels met fictieve inhoud. */
export function metrologyPrototypeRequiredFieldPreset(): Pick<
  MetrologyCapture,
  MetrologyRequiredCaptureFieldKey | "requesterConsentAccepted"
> {
  return {
    equipmentAndCalibrationNeeds:
      "Kalibratie in situ van krachtmeetketen voor drukpers (0,5–2500 kN) en jaarlijkse controle digitale dynamometer (demo-inhoud).",
    interventionSiteAddress: "Jules Bordetlaan-demo 42, Labo Noord, België (prototype-adres)",
    technicalContactEmail: "labo-contact.demo@voorbeeld.be",
    requesterConsentAccepted: true,
  };
}

export function normalizeMetrologyCapture(
  partial: Partial<MetrologyCapture> | undefined,
): MetrologyCapture {
  return {
    ...createEmptyMetrologyCapture(),
    ...partial,
    attachments: Array.isArray(partial?.attachments) ? partial.attachments : [],
  };
}

export function createEmptyMetrologyInquiry(): MetrologyInquiryState {
  return {
    capture: createEmptyMetrologyCapture(),
    stepCompleted: false,
  };
}

export function normalizeMetrologyInquiry(
  partial: Partial<MetrologyInquiryState> | undefined,
): MetrologyInquiryState {
  return {
    capture: normalizeMetrologyCapture(partial?.capture),
    stepCompleted: typeof partial?.stepCompleted === "boolean" ? partial.stepCompleted : false,
  };
}

export function metrologyCaptureSummaryRows(
  capture: MetrologyCapture,
): readonly { id: string; label: string; value: string }[] {
  const rows: { id: string; label: string; value: string }[] = [];
  const push = (id: string, label: string, raw: string) => {
    const v = raw.trim();
    if (v.length > 0) rows.push({ id, label, value: v });
  };

  push("laboratoryContext", "Laboratorium / organisatie-context", capture.laboratoryContext);
  push(
    "equipmentAndCalibrationNeeds",
    "Apparatuur en kalibratie / verificatie",
    capture.equipmentAndCalibrationNeeds,
  );
  push("standardsReferenced", "Referentienormen of certificaat-scope", capture.standardsReferenced);
  push("interventionSiteAddress", "Interventie-adres ter plaatse", capture.interventionSiteAddress);
  push("interventionRegionNotes", "Regio / land", capture.interventionRegionNotes);
  push("visitPreferenceNotes", "Planning en type tussenkomsten", capture.visitPreferenceNotes);
  push("technicalContactName", "Technisch contactpersoon", capture.technicalContactName);
  push("technicalContactPhone", "Telefoon contactpersoon", capture.technicalContactPhone);
  push("technicalContactEmail", "E-mail contactpersoon", capture.technicalContactEmail);
  push("supplementaryNotes", "Aanvullende opmerkingen", capture.supplementaryNotes);

  if (capture.requesterConsentAccepted) {
    rows.push({ id: "requesterConsentAccepted", label: "Akkoord gegevensverwerking dossier", value: "Ja" });
  }

  return rows;
}

export function metrologyAttachmentsAsDownloadableItems(
  attachments: readonly InnovationAttestMockAttachment[],
): DownloadableItemData[] {
  return attachments.map((a) => ({
    id: a.id,
    title: a.name,
    formatHint: a.sizeLabel,
    description: "Tijdelijk toegevoegd tijdens het invullen van de metrologie-intake.",
    href: `#onboarding-metrology-attachment-${a.id}`,
  }));
}

export function isMetrologyInquiryResumeOk(
  inquiry: MetrologyInquiryState,
  needsMetrology: boolean,
): boolean {
  return !needsMetrology || (isMetrologyCaptureComplete(inquiry.capture) && inquiry.stepCompleted);
}
