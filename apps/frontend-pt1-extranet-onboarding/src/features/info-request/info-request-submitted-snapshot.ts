import type { InformalIntakeCapture, OnboardingFlowState } from "@procertus-ui/ui-certification";

const STORAGE_KEY_PREFIX = "procertus.info-request-submitted.";

export type InfoRequestSubmittedPortalPerson = {
  fullName: string;
  email: string;
  roleLabel: string;
  invitedToPortal: boolean;
};

export type InfoRequestInquiryLine = {
  label: string;
  productHint?: string;
};

export type InfoRequestSubmittedSnapshot = {
  schemaVersion: 1;
  submittedAt: string;
  serviceId: string;
  serviceLabel: string;
  organizationName: string;
  submissionNote: string;
  inquiries: readonly InfoRequestInquiryLine[];
  scheduling?: {
    wantsExpertCall: boolean;
    /** Human-readable nl-BE line when preference was captured */
    preferenceLabel?: string;
  };
  portalPersons: readonly InfoRequestSubmittedPortalPerson[];
};

export function infoRequestSubmittedStorageKey(serviceId: string): string {
  return `${STORAGE_KEY_PREFIX}${serviceId}`;
}

function readInformalCaptureFromBookingStorage(bookingStorageKey: string): InformalIntakeCapture | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(bookingStorageKey);
    if (!raw?.trim()) return null;
    const parsed = JSON.parse(raw) as Partial<InformalIntakeCapture>;
    const email = typeof parsed.email === "string" ? parsed.email.trim() : "";
    if (!email) return null;
    return {
      selectedDate: parsed.selectedDate ?? null,
      selectedSlot: parsed.selectedSlot ?? null,
      firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
      lastName: typeof parsed.lastName === "string" ? parsed.lastName : "",
      email,
      jobTitle: typeof parsed.jobTitle === "string" ? parsed.jobTitle : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      company: typeof parsed.company === "string" ? parsed.company : "",
      wantsExpertCall: Boolean(parsed.wantsExpertCall),
    };
  } catch {
    return null;
  }
}

function formatNlPreferredSlotLabel(capture: InformalIntakeCapture): string | undefined {
  if (!capture.wantsExpertCall) return undefined;
  if (!capture.selectedDate) return undefined;
  const d = new Date(capture.selectedDate);
  if (Number.isNaN(d.getTime())) return undefined;
  const dateStr = d.toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const slot = capture.selectedSlot?.trim();
  return slot ? `${dateStr}, ${slot}` : dateStr;
}

function collectPortalPersons(
  intake: InformalIntakeCapture,
  flowState: OnboardingFlowState,
): InfoRequestSubmittedPortalPerson[] {
  const out: InfoRequestSubmittedPortalPerson[] = [];
  const seen = new Set<string>();

  const push = (
    fullName: string,
    email: string,
    roleLabel: string,
    invitedToPortal: boolean,
  ): void => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;
    if (seen.has(normalized)) return;
    seen.add(normalized);
    out.push({
      fullName: fullName.trim() || email.trim(),
      email: email.trim(),
      roleLabel,
      invitedToPortal,
    });
  };

  push(
    [intake.firstName.trim(), intake.lastName.trim()].filter(Boolean).join(" ").trim(),
    intake.email.trim(),
    "Contactpersoon informatieaanvraag",
    true,
  );

  const portalOptOut = flowState.summaryKlantenportaalByPersonId ?? {};
  for (const rp of flowState.context.onboardingRegisteredPersons) {
    const em = rp.person.email?.trim() ?? "";
    if (!em) continue;
    const invited = portalOptOut[rp.id] !== false;
    const nm = [rp.person.firstName?.trim(), rp.person.lastName?.trim()].filter(Boolean).join(" ").trim();
    push(nm ? nm : em, em, rp.sourceLabel?.trim() || "Extranet-gebruiker", invited);
  }

  return out;
}

/**
 * Persisted confirm payload for {@link `/welcome/info-request/:serviceId/verzonden`}.
 * Caller must persist JSON *before* {@link resetTrajectFlow}: flow state retains drafts/contact.
 */
export function buildInfoRequestSubmittedSnapshot(params: {
  flowState: OnboardingFlowState;
  serviceId: string;
  serviceLabel: string;
  /** Same key as ExpertCallBookingView `storageKey` for this route */
  bookingSessionStorageKey: string;
}): InfoRequestSubmittedSnapshot {
  const { flowState, serviceId, serviceLabel, bookingSessionStorageKey } = params;

  let intake =
    flowState.informalIntake ?? readInformalCaptureFromBookingStorage(bookingSessionStorageKey);
  if (!intake) {
    intake = {
      selectedDate: null,
      selectedSlot: null,
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      phone: "",
      company: "",
      wantsExpertCall: false,
    };
  }

  const org =
    intake.company.trim() ||
    flowState.context.organizationName.trim() ||
    serviceLabel.trim();

  const inquiries: InfoRequestInquiryLine[] = flowState.drafts.map((d) => ({
    label: (d.shortLabel?.trim() || d.label?.trim() || "Aanvraag").trim(),
    productHint: d.productLabel?.trim() || undefined,
  }));

  const preferenceLabel = formatNlPreferredSlotLabel(intake);
  const scheduling = intake.wantsExpertCall
    ? { wantsExpertCall: true as const, preferenceLabel: preferenceLabel?.trim() || undefined }
    : undefined;

  return {
    schemaVersion: 1,
    submittedAt: new Date().toISOString(),
    serviceId,
    serviceLabel,
    organizationName: org,
    submissionNote: (flowState.submissionNote ?? "").trim(),
    inquiries,
    scheduling,
    portalPersons: collectPortalPersons(intake, flowState),
  };
}

export function persistInfoRequestSubmittedSnapshot(snapshot: InfoRequestSubmittedSnapshot): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(infoRequestSubmittedStorageKey(snapshot.serviceId), JSON.stringify(snapshot));
  } catch {
    /* ignore */
  }
}

export function readInfoRequestSubmittedSnapshot(serviceId: string): InfoRequestSubmittedSnapshot | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(infoRequestSubmittedStorageKey(serviceId));
    if (!raw?.trim()) return null;
    const parsed = JSON.parse(raw) as Partial<InfoRequestSubmittedSnapshot>;
    if (parsed.schemaVersion !== 1 || typeof parsed.serviceId !== "string") return null;
    if (parsed.serviceId !== serviceId) return null;
    return parsed as InfoRequestSubmittedSnapshot;
  } catch {
    return null;
  }
}
