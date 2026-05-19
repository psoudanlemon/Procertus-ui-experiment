import type { OnboardingRegistrationCompletePayload } from "./lib/onboardingRegistrationCompleteSession";
import type { CertificationRequestDraft } from "../certification-request/types";
import { DEFAULT_CONTEXT, effectiveIncludedCertificationDraftIds } from "./onboarding-flow-helpers";
import type { CustomerContext, OnboardingFlowState } from "./onboarding-types";

export type RegistrationCompleteInquiryLine = {
  id: string;
  label: string;
  productHint?: string;
  entryId: string;
};

export type RegistrationCompletePortalPerson = {
  fullName: string;
  email: string;
  roleLabel: string;
  invitedToPortal: boolean;
};

export type RegistrationCompleteSummary = {
  organizationName: string;
  representativeEmail: string;
  includedInquiryCount: number;
  completedAtIso: string;
  submissionNote: string;
  inquiries: RegistrationCompleteInquiryLine[];
  portalPersons: RegistrationCompletePortalPerson[];
};

/** Fields read from persisted {@link OnboardingRegistrationCompletePayload.flowStateSnapshot}. */
type PersistedFormalSnapshotSubset = Pick<
  OnboardingFlowState,
  | "drafts"
  | "context"
  | "summaryIncludedDraftIds"
  | "summaryKlantenportaalByPersonId"
  | "submissionNote"
>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function coerceDraftArray(v: unknown): CertificationRequestDraft[] | null {
  if (!Array.isArray(v)) return null;
  const out: CertificationRequestDraft[] = [];
  for (const row of v) {
    if (!isRecord(row)) return null;
    const id = row.id;
    const entryId = row.entryId;
    const label = row.label;
    const shortLabel = row.shortLabel;
    if (typeof id !== "string" || typeof entryId !== "string") return null;
    if (typeof label !== "string") return null;
    if (typeof shortLabel !== "string") return null;
    out.push({
      id,
      entryId: entryId as CertificationRequestDraft["entryId"],
      label,
      shortLabel,
      productId: typeof row.productId === "string" ? row.productId : undefined,
      productTypeStreamLabel:
        typeof row.productTypeStreamLabel === "string" ? row.productTypeStreamLabel : undefined,
      productLabel: typeof row.productLabel === "string" ? row.productLabel : undefined,
      productPath: typeof row.productPath === "string" ? row.productPath : undefined,
      value: typeof row.value === "string" ? row.value : undefined,
      context: typeof row.context === "string" ? row.context : undefined,
      trajectRootServiceId:
        typeof row.trajectRootServiceId === "string" ? row.trajectRootServiceId : undefined,
    });
  }
  return out;
}

function coerceKlantenportalMap(v: unknown): Record<string, boolean> | undefined {
  if (!isRecord(v)) return undefined;
  const out: Record<string, boolean> = {};
  for (const [key, raw] of Object.entries(v)) {
    if (typeof raw === "boolean") out[key] = raw;
  }
  return out;
}

/** Best-effort parse of persisted formal onboarding JSON at dossier-submit. */
export function registrationCompleteFormalSnapshotSubset(
  snapshot: unknown,
): PersistedFormalSnapshotSubset | null {
  if (!isRecord(snapshot)) return null;
  const drafts = coerceDraftArray(snapshot.drafts);
  if (!drafts) return null;
  let context = DEFAULT_CONTEXT as CustomerContext;
  if (isRecord(snapshot.context)) {
    context = { ...DEFAULT_CONTEXT, ...(snapshot.context as CustomerContext) };
  }

  let summaryIncludedDraftIds: string[] | undefined;
  if (Array.isArray(snapshot.summaryIncludedDraftIds)) {
    if (snapshot.summaryIncludedDraftIds.every((x): x is string => typeof x === "string")) {
      summaryIncludedDraftIds = [...snapshot.summaryIncludedDraftIds];
    }
  }

  const summaryKlantenportaalByPersonId = coerceKlantenportalMap(
    snapshot.summaryKlantenportaalByPersonId,
  );

  let submissionNote: string | undefined;
  if (typeof snapshot.submissionNote === "string") submissionNote = snapshot.submissionNote;

  return {
    drafts,
    context,
    summaryIncludedDraftIds,
    summaryKlantenportaalByPersonId,
    submissionNote,
  };
}

function inquiryLinesFromIncludedDrafts(
  drafts: readonly CertificationRequestDraft[],
): RegistrationCompleteInquiryLine[] {
  return drafts.map((d) => ({
    id: d.id,
    label: (d.shortLabel?.trim() || d.label?.trim() || "Aanvraag").trim(),
    productHint: d.productLabel?.trim() || undefined,
    entryId: d.entryId,
  }));
}

function collectFormalPortalPersons(
  ctx: CustomerContext,
  klantenportal: Record<string, boolean> | undefined,
): RegistrationCompletePortalPerson[] {
  const out: RegistrationCompletePortalPerson[] = [];
  const seen = new Set<string>();

  const push = (
    fullName: string,
    email: string,
    roleLabel: string,
    invitedToPortal: boolean,
  ): void => {
    const k = email.trim().toLowerCase();
    if (!k.length) return;
    if (seen.has(k)) return;
    seen.add(k);
    out.push({
      fullName: fullName.trim() ? fullName.trim() : email.trim(),
      email: email.trim(),
      roleLabel,
      invitedToPortal,
    });
  };

  const repEmail = ctx.representativeEmail?.trim();
  if (repEmail.length > 0) {
    const nm = [ctx.representativeFirstName?.trim(), ctx.representativeLastName?.trim()]
      .filter(Boolean)
      .join(" ")
      .trim();
    const role = ctx.representativeRole?.trim() || "Hoofdaanvrager / wettelijk vertegenwoordiger";
    push(nm || repEmail, repEmail, role, true);
  }

  if (ctx.applicantIsLegalRepresentative === "no") {
    const rp = ctx.registrantPerson;
    const em = rp.email?.trim() ?? "";
    if (em) {
      const nm = [rp.firstName?.trim(), rp.lastName?.trim()].filter(Boolean).join(" ").trim();
      const role = ctx.registrantRole?.trim() || "Indiener bij registratie";
      push(nm || em, em, role, true);
    }
  }

  const opt = klantenportal ?? {};
  for (const row of ctx.onboardingRegisteredPersons ?? []) {
    const em = row.person.email?.trim() ?? "";
    if (!em) continue;
    const invited = opt[row.id] !== false;
    const nm = [row.person.firstName?.trim(), row.person.lastName?.trim()]
      .filter(Boolean)
      .join(" ")
      .trim();
    const role = row.sourceLabel?.trim() || "Contactpersoon / extranet-gebruiker";
    push(nm || em, em, role, invited);
  }

  return out;
}

/** Derives UX summary rows from localStorage dossier-complete payload (`flowStateSnapshot`). */
export function deriveRegistrationCompleteSummary(
  payload: OnboardingRegistrationCompletePayload,
): RegistrationCompleteSummary {
  const parsed = registrationCompleteFormalSnapshotSubset(payload.flowStateSnapshot);

  let inquiries: RegistrationCompleteInquiryLine[] = [];
  let submissionNote = "";
  let portalPersons: RegistrationCompletePortalPerson[] = [];

  if (parsed) {
    submissionNote = (parsed.submissionNote ?? "").trim();
    const ids = effectiveIncludedCertificationDraftIds(
      parsed.drafts,
      parsed.summaryIncludedDraftIds,
    );
    const includedDrafts =
      ids.length === 0
        ? ([] as CertificationRequestDraft[])
        : parsed.drafts.filter((d) => ids.includes(d.id));
    inquiries = inquiryLinesFromIncludedDrafts(includedDrafts);
    portalPersons = collectFormalPortalPersons(
      parsed.context,
      parsed.summaryKlantenportaalByPersonId,
    );
  }

  let fallbackPortalRows: RegistrationCompletePortalPerson[] = [];
  const repTrim = payload.representativeEmail.trim();
  if (repTrim.length > 0 && portalPersons.length === 0) {
    let fullName = repTrim;
    if (parsed) {
      const nm = [
        parsed.context.representativeFirstName?.trim(),
        parsed.context.representativeLastName?.trim(),
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
      if (nm) fullName = nm;
    }
    fallbackPortalRows.push({
      fullName,
      email: repTrim,
      roleLabel:
        parsed?.context.representativeRole?.trim() ||
        "Hoofdaanvrager / wettelijk vertegenwoordiger",
      invitedToPortal: true,
    });
  }

  return {
    organizationName: payload.organizationName.trim(),
    representativeEmail: payload.representativeEmail.trim(),
    includedInquiryCount: payload.includedInquiryCount,
    completedAtIso: payload.completedAt,
    submissionNote,
    inquiries,
    portalPersons: portalPersons.length > 0 ? portalPersons : fallbackPortalRows,
  };
}
