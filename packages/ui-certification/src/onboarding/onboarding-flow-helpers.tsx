import type {
  RequestPackageReviewRequesterPresentation,
  RequestPackageRow,
} from "../components/request-package-review";
import type { CertificationRequestDraft } from "../CertificationRequestContext";
import {
  customerContextToFirmaAddressCapture,
  identificatiePersonCaptureSchema,
  identificatieStreetAddressCaptureSchema,
  isFirmaAddressCaptureComplete,
  isOnboardingInvoicingCaptureValid,
  personSubformValueToCapture,
} from "@procertus-ui/domain-certification";
import { ONBOARDING_FLOW_STORAGE_KEY } from "./lib/onboardingRegistrationCompleteSession";
import type { IdentificatieAddressSubformValue } from "./identificatie-subforms";
import {
  ONBOARDING_STEPS,
  type CustomerContext,
  type IdentificatiePersonCaptureState,
  type OnboardingRegisteredPerson,
  type OnboardingStep,
  type OnboardingVestiging,
} from "./onboarding-types";
import {
  ONBOARDING_REQUEST_ORIGIN_OPTIONS,
  type OnboardingRequestOrigin,
} from "./onboarding-request-origin";
import { roleLabelForPresetId, titleLabelForPresetId } from "./lib/registrationPersonOptions";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  deriveCountryFromVat,
  findVatPrototypePreset,
  getPersonContextFieldsForPrototypePreset,
  getRegistrantContextFieldsForPrototypePreset,
  registrationIsoCodeFromDutchCountryLabel,
  VAT_PROTOTYPE_PRESETS,
  type VatPrototypePreset,
} from "./lib/vatPrototypePresets";

export function emptyIdentificatiePersonState(): IdentificatiePersonCaptureState {
  return { firstName: "", lastName: "", title: "", telephone: "", email: "" };
}

/** Picker value: choose “new person”; existing rows use their registry UUID. */
export const ONBOARDING_PERSON_NEW_ID = "__new__";

export function newOnboardingVestigingId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `vest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyOnboardingVestiging(id?: string): OnboardingVestiging {
  return {
    id: id ?? newOnboardingVestigingId(),
    legalName: "",
    addressStreet: "",
    addressHouseNumber: "",
    addressPostalCode: "",
    addressCity: "",
    country: "",
    addressCountryCode: "",
  };
}

export function onboardingVestigingAddressCapture(v: OnboardingVestiging) {
  return {
    addressStreet: v.addressStreet,
    addressHouseNumber: v.addressHouseNumber,
    addressPostalCode: v.addressPostalCode,
    addressCity: v.addressCity,
    country: v.country,
    addressCountryCode: v.addressCountryCode,
  };
}

export function isOnboardingVestigingCaptureComplete(v: OnboardingVestiging): boolean {
  if (!(v.legalName?.trim() ?? "").length) return false;
  return isFirmaAddressCaptureComplete(onboardingVestigingAddressCapture(v));
}

export function vestigingAddressSubformValue(v: OnboardingVestiging): IdentificatieAddressSubformValue {
  return {
    street: v.addressStreet,
    houseNumber: v.addressHouseNumber,
    postalCode: v.addressPostalCode,
    locality: v.addressCity,
    country: v.country,
    countryCode: v.addressCountryCode,
  };
}

export function formatVestigingRegistryOptionLabel(v: OnboardingVestiging): string {
  const addr = onboardingVestigingAddressCapture(v);
  const n = v.legalName.trim() || "Naam nog niet ingevuld";
  const line = [addr.addressStreet.trim(), addr.addressPostalCode.trim(), addr.addressCity.trim()].filter(Boolean);
  const tail = line.length ? line.join(", ") : "";
  return tail ? `${n} · ${tail}` : n;
}

/** When head office cannot cover certifications, each inquiry draft must reference a completed vestiging (reuse allowed). */
export function isCertificationVestigingMappingComplete(
  context: CustomerContext,
  inquiryDraftIds: readonly string[],
): boolean {
  if (context.headOfficeIsCertificationLegalEntity !== "no") return true;
  if (inquiryDraftIds.length === 0) return true;
  if (context.onboardingVestigingen.length === 0) return false;

  const byId = new Map(context.onboardingVestigingen.map((ve) => [ve.id, ve]));
  const validSet = new Set(
    context.onboardingVestigingen.filter(isOnboardingVestigingCaptureComplete).map((ve) => ve.id),
  );

  return inquiryDraftIds.every((did) => {
    const vid = (context.certificationInquiryVestigingId[did] ?? "").trim();
    if (!vid || !validSet.has(vid)) return false;
    const v = byId.get(vid);
    return v !== undefined && isOnboardingVestigingCaptureComplete(v);
  });
}

/** Clears organisation capture and reapplies demo vertegenwoordiger fields for a new VAT prototype preset. */
export function customerContextAfterPrototypePresetChange(
  prev: CustomerContext,
  preset: VatPrototypePreset,
): CustomerContext {
  const registrantReset =
    prev.applicantIsLegalRepresentative === "no"
      ? getRegistrantContextFieldsForPrototypePreset(preset)
      : {
          registrantPerson: emptyIdentificatiePersonState(),
          registrantTitlePreset: "none",
          registrantTitle: "",
          registrantRolePreset: "none",
          registrantRole: "",
        };

  return resolveFlowContext({
    ...prev,
    ...getPersonContextFieldsForPrototypePreset(preset),
    vatNumber: preset.vatNumber,
    organizationName: "",
    country: "",
    addressStreet: "",
    addressHouseNumber: "",
    addressPostalCode: "",
    addressCity: "",
    addressCountryCode: "",
    firmaPhone: "",
    legalRepresentativePhone: "",
    addCertificationContactOverride: false,
    addCertificationSecondaryContact: false,
    addInvoicingAddressOverride: false,
    invoicingUseContactPerson: false,
    onboardingRegisteredPersons: [],
    onboardingVestigingen: [],
    certificationInquiryVestigingId: {},
    headOfficeIsCertificationLegalEntity: "",
    invoicingDiffersFromHeadOffice: false,
    invoicingVestigingId: "",
    invoicingEmail: "",
    invoicingContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
    certificationContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
    certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
    ...registrantReset,
  });
}

export function formatRequesterDisplayName(context: CustomerContext): string {
  const title = context.representativeTitle?.trim() ?? "";
  const first = context.representativeFirstName?.trim() ?? "";
  const last = context.representativeLastName?.trim() ?? "";
  return [title, first, last].filter(Boolean).join(" ");
}

/** Display name for the person filling in the form when they are not the legal representative. */
export function formatRegistrantDisplayName(context: CustomerContext): string {
  const title = context.registrantTitle?.trim() ?? "";
  const first = context.registrantPerson?.firstName?.trim() ?? "";
  const last = context.registrantPerson?.lastName?.trim() ?? "";
  return [title, first, last].filter(Boolean).join(" ");
}

export function formatRequesterStepperLabel(context: CustomerContext): string {
  if (context.applicantIsLegalRepresentative === "no") {
    const first = context.registrantPerson.firstName?.trim() ?? "";
    const last = context.registrantPerson.lastName?.trim() ?? "";
    const n = [first, last].filter(Boolean).join(" ");
    if (n) return n;
  }
  const first = context.representativeFirstName?.trim() ?? "";
  const last = context.representativeLastName?.trim() ?? "";
  return [first, last].filter(Boolean).join(" ") || "Vertegenwoordiger";
}

export function formatPostalAddressDisplay(context: CustomerContext): string {
  const line1 = [context.addressStreet?.trim(), context.addressHouseNumber?.trim()]
    .filter(Boolean)
    .join(" ");
  const line2 = [context.addressPostalCode?.trim(), context.addressCity?.trim()]
    .filter(Boolean)
    .join(" ");
  return [line1, line2].filter(Boolean).join(", ") || "—";
}

export function formatOnboardingVestigingPostalLine(v: OnboardingVestiging): string {
  const addr = onboardingVestigingAddressCapture(v);
  const line1 = [`${addr.addressStreet?.trim()}`, `${addr.addressHouseNumber?.trim()}`].filter(Boolean).join(" ");
  const line2 = [`${addr.addressPostalCode?.trim()}`, `${addr.addressCity?.trim()}`].filter(Boolean).join(" ");
  const country = `${addr.country?.trim()}`;
  const parts = [line1, line2, country].filter(Boolean);
  return parts.join(", ") || "—";
}

export function hasStructuredPostalAddress(context: CustomerContext): boolean {
  return isFirmaAddressCaptureComplete({
    addressStreet: context.addressStreet,
    addressHouseNumber: context.addressHouseNumber,
    addressPostalCode: context.addressPostalCode,
    addressCity: context.addressCity,
    country: context.country,
  });
}

export function mergeCustomerContextDeep(
  base: CustomerContext,
  patch: Partial<CustomerContext>,
): CustomerContext {
  const next: CustomerContext = { ...base, ...patch };
  if (patch.certificationContact !== undefined) {
    next.certificationContact = { ...base.certificationContact, ...patch.certificationContact };
  }
  if (patch.certificationSecondary !== undefined) {
    next.certificationSecondary = {
      ...base.certificationSecondary,
      ...patch.certificationSecondary,
    };
  }
  if (patch.invoicingContactPerson !== undefined) {
    next.invoicingContactPerson = {
      ...base.invoicingContactPerson,
      ...patch.invoicingContactPerson,
    };
  }
  if (patch.registrantPerson !== undefined) {
    next.registrantPerson = { ...base.registrantPerson, ...patch.registrantPerson };
  }
  if (patch.onboardingRegisteredPersons !== undefined) {
    next.onboardingRegisteredPersons = patch.onboardingRegisteredPersons.map((p) => ({
      ...p,
      person: { ...p.person },
    }));
  }
  if (patch.onboardingVestigingen !== undefined) {
    next.onboardingVestigingen = patch.onboardingVestigingen.map((v) => ({ ...v }));
  }
  return syncOnboardingRegisteredPersons(next);
}

function prototypeDemoEmailDomain(representativeEmail: string): string {
  const t = representativeEmail.trim();
  const at = t.indexOf("@");
  if (at < 0 || at === t.length - 1) return "voorbeeld.proc";
  const d = t.slice(at + 1).trim();
  return d.length > 0 ? d : "voorbeeld.proc";
}

/**
 * Prototype demo: after {@link enrichRegistrationContext}, merge this patch so optional blocks
 * (cert contacts, invoicing, phones, ISO code) are on and filled. Scalar fields use `||` fallbacks
 * when still empty so existing user input is kept.
 */
export function prototypeOptionalDemoContextPatch(
  base: CustomerContext,
  preset: VatPrototypePreset,
): Partial<CustomerContext> {
  const domain = prototypeDemoEmailDomain(base.representativeEmail);
  const country =
    base.country.trim() ||
    preset.mock.countryFallback.trim() ||
    deriveCountryFromVat(base.vatNumber).trim() ||
    "België";

  const iso =
    base.addressCountryCode.trim() || registrationIsoCodeFromDutchCountryLabel(country) || "";

  const street = base.addressStreet.trim() || preset.mock.addressStreet;
  const house = base.addressHouseNumber.trim() || preset.mock.addressHouseNumber;
  const pc = base.addressPostalCode.trim() || preset.mock.addressPostalCode;
  const city = base.addressCity.trim() || preset.mock.addressCity;

  const certTitle = titleLabelForPresetId("mr");
  const certPrimary = emptyIdentificatiePersonState();
  certPrimary.firstName = "Kim";
  certPrimary.lastName = "Vandenberghe";
  certPrimary.title = certTitle;
  certPrimary.telephone = "+32 2 700 10 01";
  certPrimary.email = `certificatie@${domain}`;

  const certSecondary = emptyIdentificatiePersonState();
  certSecondary.firstName = "Robin";
  certSecondary.lastName = "Janssens";
  certSecondary.title = "";
  certSecondary.telephone = "+32 2 700 10 02";
  certSecondary.email = `inspectie@${domain}`;

  const invPerson = emptyIdentificatiePersonState();
  invPerson.firstName = "Els";
  invPerson.lastName = "Declercq";
  invPerson.title = "";
  invPerson.telephone = "+32 2 700 20 00";
  invPerson.email = `fin.admin@${domain}`;

  return {
    addressCountryCode: base.addressCountryCode.trim() || iso,
    firmaPhone: base.firmaPhone.trim() || "+32 2 123 45 67",
    legalRepresentativePhone:
      base.legalRepresentativePhone.trim() ||
      base.registrantPerson.telephone.trim() ||
      "+32 470 99 88 77",
    addCertificationContactOverride: true,
    certificationContact: certPrimary,
    certificationContactTitlePreset: "mr",
    certificationContactTitle: certTitle,
    certificationContactRolePreset: "quality",
    certificationContactRole: roleLabelForPresetId("quality"),
    addCertificationSecondaryContact: true,
    certificationSecondary: certSecondary,
    certificationSecondaryTitlePreset: "none",
    certificationSecondaryTitle: "",
    certificationSecondaryRolePreset: "technical",
    certificationSecondaryRole: roleLabelForPresetId("technical"),
    invoicingEmail: base.invoicingEmail.trim() || `facturatie@${domain}`,
    invoicingUseContactPerson: true,
    invoicingContactPerson: invPerson,
    addInvoicingAddressOverride: false,
    invoicingAddressStreet: street,
    invoicingAddressHouseNumber: house,
    invoicingAddressPostalCode: pc,
    invoicingAddressCity: city,
    invoicingCountry: country,
    invoicingAddressCountryCode: iso,
    headOfficeIsCertificationLegalEntity: "yes",
  };
}

export function legalRepresentativePersonValue(
  context: CustomerContext,
): IdentificatiePersonCaptureState {
  return {
    firstName: context.representativeFirstName,
    lastName: context.representativeLastName,
    title: context.representativeTitle,
    telephone: context.legalRepresentativePhone,
    email: context.representativeEmail,
  };
}

/** Subform value for the registrant; `title` tracks {@link CustomerContext.registrantTitle}. */
export function registrantPersonFormValue(
  context: CustomerContext,
): IdentificatiePersonCaptureState {
  return {
    ...context.registrantPerson,
    title: context.registrantTitle,
  };
}

function onboardingSummaryPersonIdentityMatch(
  row: IdentificatiePersonCaptureState,
  slot: IdentificatiePersonCaptureState,
): boolean {
  const re = row.email?.trim().toLowerCase() ?? "";
  const se = slot.email?.trim().toLowerCase() ?? "";
  if (re && se && re !== se) {
    return false;
  }
  if (!re && !se) {
    return (
      (row.firstName?.trim() ?? "") === (slot.firstName?.trim() ?? "") &&
      (row.lastName?.trim() ?? "") === (slot.lastName?.trim() ?? "")
    );
  }
  return (
    re === se &&
    (row.firstName?.trim() ?? "") === (slot.firstName?.trim() ?? "") &&
    (row.lastName?.trim() ?? "") === (slot.lastName?.trim() ?? "")
  );
}

const SUMMARY_ROLE_PREFIX_ORDER = [
  "Wettelijke vertegenwoordiger",
  "Indiener",
  "Contact facturatie",
  "Certificatie en inspectie",
  "Reserve certificatie en inspectie",
] as const;

function summaryRoleSortKey(label: string): number {
  const idx = SUMMARY_ROLE_PREFIX_ORDER.findIndex(
    (prefix) => label === prefix || label.startsWith(`${prefix} (`),
  );
  return idx === -1 ? 999 : idx;
}

/** Full name for Nazicht person rows. */
export function summaryDisplayNameForRegisteredPerson(row: OnboardingRegisteredPerson): string {
  const name = [row.person.firstName?.trim(), row.person.lastName?.trim()]
    .filter(Boolean)
    .join(" ");
  return name.length > 0 ? name : "Naamloos";
}

/** Functional / form rollen shown on the summary person table (deduped, stable order). */
export function summaryRolesForRegisteredPerson(
  context: CustomerContext,
  row: OnboardingRegisteredPerson,
): string[] {
  const id = row.id;
  const roles: string[] = [];

  if (onboardingSummaryPersonIdentityMatch(row.person, legalRepresentativePersonValue(context))) {
    const rr = context.representativeRole?.trim();
    roles.push(rr ? `Wettelijke vertegenwoordiger (${rr})` : "Wettelijke vertegenwoordiger");
  }

  if (
    context.applicantIsLegalRepresentative === "no" &&
    onboardingSummaryPersonIdentityMatch(row.person, registrantPersonFormValue(context))
  ) {
    const rr = context.registrantRole?.trim();
    roles.push(rr ? `Indiener (${rr})` : "Indiener");
  }

  if (
    !context.invoicingUseContactPerson &&
    onboardingSummaryPersonIdentityMatch(row.person, legalRepresentativePersonValue(context))
  ) {
    roles.push("Factuurcontact (standaard)");
  }

  if (context.invoicingUseContactPerson && context.invoicingContactPersonRegistryId === id) {
    roles.push("Contact facturatie");
  }

  if (
    context.addCertificationContactOverride &&
    context.certificationContactPersonRegistryId === id
  ) {
    const cr = context.certificationContactRole?.trim();
    roles.push(cr ? `Certificatie en inspectie (${cr})` : "Certificatie en inspectie");
  }

  if (
    context.addCertificationSecondaryContact &&
    context.certificationSecondaryPersonRegistryId === id
  ) {
    const sr = context.certificationSecondaryRole?.trim();
    roles.push(
      sr ? `Reserve certificatie en inspectie (${sr})` : "Reserve certificatie en inspectie",
    );
  }

  const unique = Array.from(new Set(roles));
  unique.sort((a, b) => summaryRoleSortKey(a) - summaryRoleSortKey(b) || a.localeCompare(b, "nl"));
  return unique;
}

export type OnboardingPackageEntityRecord = {
  id: string;
  /** Short label shown in the overview table (e.g. entity kind + name). */
  title: string;
  /** Single human-readable block for that record (multi-line allowed). */
  summary: string;
};

function summaryLine(label: string, value: string | undefined | null): string | null {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v || v === "—") return null;
  return `${label}: ${v}`;
}

function composeEntitySummary(lines: Array<string | null | undefined>): string {
  return lines.filter((x): x is string => typeof x === "string" && x.trim().length > 0).join("\n");
}

function effectiveTitleFromPreset(preset: string, freeText: string): string {
  const p = preset?.trim() ?? "none";
  if (p === "none") return freeText.trim();
  if (p === "other") return freeText.trim();
  return titleLabelForPresetId(p) || p;
}

function effectiveRoleFromPreset(preset: string, freeText: string): string {
  const p = preset?.trim() ?? "none";
  if (p === "none") return freeText.trim();
  if (p === "other") return freeText.trim();
  return roleLabelForPresetId(p) || p;
}

function formatPersonCaptureBlock(person: IdentificatiePersonCaptureState): string {
  return composeEntitySummary([
    summaryLine("Aanhef", person.title),
    person.firstName?.trim() || person.lastName?.trim()
      ? `Naam: ${[person.firstName, person.lastName].filter(Boolean).join(" ").trim()}`
      : null,
    summaryLine("E-mail", person.email),
    summaryLine("Telefoon", person.telephone),
  ]);
}

/** Name / e-mail / phone only — use when aanhef is already given above (e.g. preset line). */
function formatPersonIdentityLines(person: IdentificatiePersonCaptureState): string {
  return composeEntitySummary([
    person.firstName?.trim() || person.lastName?.trim()
      ? `Naam: ${[person.firstName, person.lastName].filter(Boolean).join(" ").trim()}`
      : null,
    summaryLine("E-mail", person.email),
    summaryLine("Telefoon", person.telephone),
  ]);
}

/**
 * One row per logical entity for the Nazicht “full dataset” table: each `summary` is a single
 * formatted string (no per-field rows). Klantenportaal intent per register row is folded into
 * that person’s summary using `klantenportaalByPersonId` (`!== false` → onboarding aan).
 */
export function buildFullOnboardingPackageEntityRecords(
  context: CustomerContext,
  drafts: readonly CertificationRequestDraft[],
  includedDraftIds: readonly string[],
  requestOrigin: OnboardingRequestOrigin | "",
  klantenportaalByPersonId: Record<string, boolean | undefined>,
): OnboardingPackageEntityRecord[] {
  const records: OnboardingPackageEntityRecord[] = [];
  const included = drafts.filter((d) => includedDraftIds.includes(d.id));

  const originTitle =
    requestOrigin === ""
      ? ""
      : (ONBOARDING_REQUEST_ORIGIN_OPTIONS.find((o) => o.id === requestOrigin)?.title ??
        requestOrigin);

  const applicantLr =
    context.applicantIsLegalRepresentative === "yes"
      ? "Ja"
      : context.applicantIsLegalRepresentative === "no"
        ? "Nee"
        : null;

  records.push({
    id: "registratie",
    title: "Registratie",
    summary: composeEntitySummary([
      summaryLine("Vestigingsland of regio", originTitle),
      applicantLr ? summaryLine("Indiener is wettelijke vertegenwoordiger", applicantLr) : null,
    ]),
  });

  records.push({
    id: "organisatie",
    title: "Organisatie · maatschappelijke zetel",
    summary: composeEntitySummary([
      summaryLine("Bedrijfsnaam (zetel)", context.organizationName),
      summaryLine("Identificatienummer (btw/kvk/…)", context.vatNumber),
      summaryLine("Land (zetel)", context.country),
      summaryLine("Adres zetel", formatPostalAddressDisplay(context)),
      summaryLine("Adres landcode (ISO)", context.addressCountryCode),
      summaryLine("Telefoon firma", context.firmaPhone),
    ]),
  });

  const certEntityYes =
    context.headOfficeIsCertificationLegalEntity === "yes"
      ? "Ja — de maatschappelijke zetel kan optreden als rechts-persoon voor alle geselecteerde certificaties."
      : context.headOfficeIsCertificationLegalEntity === "no"
        ? "Nee — per certificatievraag wijzen we een vestiging toe (naam en adres zonder apart btw-nummer)."
        : null;

  records.push({
    id: "certification-legal-entity",
    title: "Certificatie en juridische entiteit",
    summary: composeEntitySummary([
      summaryLine(
        "Maatschappelijke zetel volstaat juridisch voor certificatie",
        certEntityYes,
      ),
    ]),
  });

  if (context.headOfficeIsCertificationLegalEntity === "no" && context.onboardingVestigingen.length > 0) {
    context.onboardingVestigingen.forEach((ve, index) => {
      records.push({
        id: `vestiging-${ve.id}`,
        title: `Vestiging ${index + 1}`,
        summary: composeEntitySummary([
          summaryLine("Juridische naam vestiging", ve.legalName || "—"),
          summaryLine("Adres vestiging", formatOnboardingVestigingPostalLine(ve)),
          summaryLine("Landcode (ISO)", ve.addressCountryCode),
        ]),
      });
    });
  }

  records.push({
    id: "wettelijke-vertegenwoordiger",
    title: "Wettelijke vertegenwoordiger",
    summary: composeEntitySummary([
      summaryLine(
        "Aanhef",
        effectiveTitleFromPreset(context.representativeTitlePreset, context.representativeTitle),
      ),
      summaryLine(
        "Functie",
        effectiveRoleFromPreset(context.representativeRolePreset, context.representativeRole),
      ),
      formatPersonIdentityLines(legalRepresentativePersonValue(context)),
    ]),
  });

  if (context.applicantIsLegalRepresentative === "no") {
    records.push({
      id: "indiener",
      title: "Indiener",
      summary: composeEntitySummary([
        summaryLine(
          "Aanhef",
          effectiveTitleFromPreset(context.registrantTitlePreset, context.registrantTitle),
        ),
        summaryLine(
          "Functie",
          effectiveRoleFromPreset(context.registrantRolePreset, context.registrantRole),
        ),
        formatPersonIdentityLines(registrantPersonFormValue(context)),
      ]),
    });
  }

  const factuurLines: Array<string | null> = [
    summaryLine(
      "Facturatie op naam van",
      context.invoicingDiffersFromHeadOffice
        ? (() => {
            const id = (context.invoicingVestigingId ?? "").trim();
            const ve = context.onboardingVestigingen.find((x) => x.id === id);
            return ve && isOnboardingVestigingCaptureComplete(ve)
              ? `${ve.legalName.trim()} · ${formatOnboardingVestigingPostalLine(ve)}`
              : ve
                ? `${ve.legalName.trim() || "—"} · adres nog aan te vullen`
                : "—";
          })()
        : `${context.organizationName.trim() || "—"} · ${formatPostalAddressDisplay(context)}`,
    ),
    summaryLine("E-mail facturatie", context.invoicingEmail),
  ];
  factuurLines.push(
    summaryLine(
      "Factuurcontact",
      context.invoicingUseContactPerson
        ? "Andere persoon dan wettelijke vertegenwoordiger"
        : "Wettelijke vertegenwoordiger (standaard)",
    ),
  );
  if (context.invoicingUseContactPerson) {
    factuurLines.push(
      summaryLine("Gekoppeld register-id (facturatie)", context.invoicingContactPersonRegistryId),
    );
  }
  factuurLines.push(
    formatPersonIdentityLines(
      context.invoicingUseContactPerson
        ? context.invoicingContactPerson
        : legalRepresentativePersonValue(context),
    ),
  );
  factuurLines.push(
    `Afwijkend facturatieadres: ${context.addInvoicingAddressOverride ? "ja" : "nee"}`,
  );
  if (context.addInvoicingAddressOverride) {
    const cap = invoicingAddressCapture(context);
    factuurLines.push(
      summaryLine(
        "Facturatieadres",
        `${cap.street} ${cap.houseNumber}, ${cap.postalCode} ${cap.locality}`.trim(),
      ),
    );
    factuurLines.push(summaryLine("Land (facturatie)", cap.countryLabel));
    factuurLines.push(
      summaryLine("Landcode facturatie (ISO)", context.invoicingAddressCountryCode),
    );
  }
  records.push({
    id: "facturatie",
    title: "Facturatie",
    summary: composeEntitySummary(factuurLines),
  });

  if (context.addCertificationContactOverride) {
    records.push({
      id: "certificatie-hoofdcontact",
      title: "Certificatie en inspectie · Hoofdcontact",
      summary: composeEntitySummary([
        summaryLine("Gekoppeld register-id", context.certificationContactPersonRegistryId),
        summaryLine(
          "Aanhef",
          effectiveTitleFromPreset(
            context.certificationContactTitlePreset,
            context.certificationContactTitle,
          ),
        ),
        summaryLine(
          "Functie",
          effectiveRoleFromPreset(
            context.certificationContactRolePreset,
            context.certificationContactRole,
          ),
        ),
        formatPersonIdentityLines(certificationContactPersonFormValue(context)),
      ]),
    });
  }

  if (context.addCertificationSecondaryContact) {
    records.push({
      id: "certificatie-reservecontact",
      title: "Certificatie en inspectie · Reservecontact",
      summary: composeEntitySummary([
        summaryLine("Gekoppeld register-id", context.certificationSecondaryPersonRegistryId),
        summaryLine(
          "Aanhef",
          effectiveTitleFromPreset(
            context.certificationSecondaryTitlePreset,
            context.certificationSecondaryTitle,
          ),
        ),
        summaryLine(
          "Functie",
          effectiveRoleFromPreset(
            context.certificationSecondaryRolePreset,
            context.certificationSecondaryRole,
          ),
        ),
        formatPersonIdentityLines(certificationSecondaryPersonFormValue(context)),
      ]),
    });
  }

  for (const p of context.onboardingRegisteredPersons) {
    const name = summaryDisplayNameForRegisteredPerson(p);
    const roles = summaryRolesForRegisteredPerson(context, p);
    const kp = klantenportaalByPersonId[p.id] !== false ? "Ja" : "Nee";
    records.push({
      id: `personenregister-${p.id}`,
      title: `Personenregister · ${name}`,
      summary: composeEntitySummary([
        summaryLine("Bronlabel", p.sourceLabel),
        roles.length > 0 ? `Rollen: ${roles.join("; ")}` : null,
        formatPersonCaptureBlock(p.person),
        `Klantenportaal-onboarding: ${kp}`,
      ]),
    });
  }

  records.push({
    id: "aanvraagpakket-meta",
    title: "Aanvraagpakket",
    summary: composeEntitySummary([
      `Conceptaanvragen in sessie: ${drafts.length}`,
      `Opgenomen in deze zending: ${included.length}`,
    ]),
  });

  included.forEach((draft, index) => {
    records.push({
      id: `conceptaanvraag-${draft.id}`,
      title: `Conceptaanvraag ${index + 1} · ${draft.label}`,
      summary: composeEntitySummary([
        summaryLine("Id", draft.id),
        summaryLine("Korte label", draft.shortLabel),
        summaryLine("Entry-id", draft.entryId),
        summaryLine("Product-id", draft.productId),
        summaryLine("Productlabel", draft.productLabel),
        summaryLine("Productstroom", draft.productTypeStreamLabel),
        summaryLine("Productpad", draft.productPath),
        summaryLine("Waarde", draft.value),
        summaryLine("Context", draft.context),
        context.headOfficeIsCertificationLegalEntity === "no"
          ? summaryLine(
              "Vestiging (rechtspersoon certificatie)",
              (() => {
                const vid = (context.certificationInquiryVestigingId[draft.id] ?? "").trim();
                const ve = vid ? context.onboardingVestigingen.find((x) => x.id === vid) : undefined;
                return ve !== undefined && isOnboardingVestigingCaptureComplete(ve)
                  ? `${ve.legalName.trim()} · ${formatOnboardingVestigingPostalLine(ve)}`
                  : ve !== undefined
                    ? "— (vestiging onvolledig)"
                    : "—";
              })(),
            )
          : context.headOfficeIsCertificationLegalEntity === "yes"
            ? summaryLine("Vestiging", "Rechts-persoon: maatschappelijke zetel (zie organisatie)")
            : null,
      ]),
    });
  });

  return records;
}

export function certificationContactPersonFormValue(
  context: CustomerContext,
): IdentificatiePersonCaptureState {
  return {
    ...context.certificationContact,
    title: context.certificationContactTitle,
  };
}

export function certificationSecondaryPersonFormValue(
  context: CustomerContext,
): IdentificatiePersonCaptureState {
  return {
    ...context.certificationSecondary,
    title: context.certificationSecondaryTitle,
  };
}

function normalizedPersonEmailKey(email: string): string {
  return email.trim().toLowerCase();
}

function newPersonRegistryRowId(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) {
    return c.randomUUID();
  }
  return `rp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function personValidForRegistry(person: IdentificatiePersonCaptureState): boolean {
  return identificatiePersonCaptureSchema.safeParse(personSubformValueToCapture(person)).success;
}

function copyPersonState(person: IdentificatiePersonCaptureState): IdentificatiePersonCaptureState {
  return { ...person };
}

/**
 * Keeps {@link CustomerContext.onboardingRegisteredPersons} in sync with legal rep, registrant, and
 * optional slots so pickers can list everyone registered during the flow (deduped by e-mail).
 */
export function syncOnboardingRegisteredPersons(ctx: CustomerContext): CustomerContext {
  const byId = new Map(
    ctx.onboardingRegisteredPersons.map((p) => [p.id, { ...p, person: { ...p.person } }]),
  );
  const emailToId = new Map<string, string>();
  for (const row of byId.values()) {
    const ek = normalizedPersonEmailKey(row.person.email);
    if (ek) {
      emailToId.set(ek, row.id);
    }
  }

  const ensure = (person: IdentificatiePersonCaptureState, label?: string) => {
    if (!personValidForRegistry(person)) {
      return;
    }
    const ek = normalizedPersonEmailKey(person.email);
    const existingId = emailToId.get(ek);
    if (existingId && byId.has(existingId)) {
      const cur = byId.get(existingId)!;
      cur.person = copyPersonState(person);
      if (label) {
        cur.sourceLabel = label;
      }
      return;
    }
    const id = newPersonRegistryRowId();
    emailToId.set(ek, id);
    byId.set(id, { id, sourceLabel: label, person: copyPersonState(person) });
  };

  const updateById = (
    registryId: string,
    person: IdentificatiePersonCaptureState,
    label?: string,
  ) => {
    if (!registryId || registryId === ONBOARDING_PERSON_NEW_ID) {
      return;
    }
    const cur = byId.get(registryId);
    if (!cur) {
      return;
    }
    cur.person = copyPersonState(person);
    if (label) {
      cur.sourceLabel = label;
    }
    const ek = normalizedPersonEmailKey(person.email);
    if (ek) {
      emailToId.set(ek, registryId);
    }
  };

  ensure(legalRepresentativePersonValue(ctx), "Wettelijk vertegenwoordiger");
  if (ctx.applicantIsLegalRepresentative === "no") {
    ensure(registrantPersonFormValue(ctx), "Indiener");
  }

  if (ctx.invoicingUseContactPerson) {
    const rId = ctx.invoicingContactPersonRegistryId;
    if (rId && rId !== ONBOARDING_PERSON_NEW_ID) {
      updateById(rId, ctx.invoicingContactPerson, "Facturatiecontact");
    } else {
      ensure(ctx.invoicingContactPerson);
    }
  }

  if (ctx.addCertificationContactOverride) {
    const rId = ctx.certificationContactPersonRegistryId;
    const pv = certificationContactPersonFormValue(ctx);
    if (rId && rId !== ONBOARDING_PERSON_NEW_ID) {
      updateById(rId, pv, "Certificatie en inspectie");
    } else {
      ensure(pv);
    }
  }

  if (ctx.addCertificationSecondaryContact) {
    const rId = ctx.certificationSecondaryPersonRegistryId;
    const pv = certificationSecondaryPersonFormValue(ctx);
    if (rId && rId !== ONBOARDING_PERSON_NEW_ID) {
      updateById(rId, pv, "Certificatie (tweede)");
    } else {
      ensure(pv);
    }
  }

  return {
    ...ctx,
    onboardingRegisteredPersons: [...byId.values()],
  };
}

export function formatOnboardingPersonRegistryOptionLabel(p: OnboardingRegisteredPerson): string {
  const name = [p.person.firstName?.trim(), p.person.lastName?.trim()].filter(Boolean).join(" ");
  return name.length > 0 ? name : "Naamloos";
}

export function isLegalRepresentativePersonValid(context: CustomerContext): boolean {
  return identificatiePersonCaptureSchema.safeParse(
    personSubformValueToCapture(legalRepresentativePersonValue(context)),
  ).success;
}

/** Person + contact for the legal-representative block; title and role presets are optional. */
export function isLegalRepresentativeCaptureComplete(context: CustomerContext): boolean {
  return isLegalRepresentativePersonValid(context);
}

/** When the applicant is not the legal representative, their details must be complete. */
export function isRegistrantCaptureValidForContext(context: CustomerContext): boolean {
  if (context.applicantIsLegalRepresentative !== "no") return true;
  const personOk = identificatiePersonCaptureSchema.safeParse(
    personSubformValueToCapture(registrantPersonFormValue(context)),
  ).success;
  return personOk;
}

function invoicingAddressCapture(context: CustomerContext) {
  return customerContextToFirmaAddressCapture({
    addressStreet: context.invoicingAddressStreet,
    addressHouseNumber: context.invoicingAddressHouseNumber,
    addressPostalCode: context.invoicingAddressPostalCode,
    addressCity: context.invoicingAddressCity,
    country: context.invoicingCountry,
    addressCountryCode: context.invoicingAddressCountryCode,
  });
}

/** Organisation name, firma address, certification legal entity / vestigingen (company step only). */
export function isOnboardingCompanyCoreStepValid(
  context: CustomerContext,
  certificationInquiryDraftIds: readonly string[],
): boolean {
  if (!(context.organizationName?.trim() ?? "").length || !hasStructuredPostalAddress(context)) {
    return false;
  }
  const rel = context.headOfficeIsCertificationLegalEntity;
  if (rel !== "yes" && rel !== "no") {
    return false;
  }
  if (!isCertificationVestigingMappingComplete(context, certificationInquiryDraftIds)) {
    return false;
  }
  return true;
}

/** Facturatie-e-mail, juridisch facturatiedrukker (zetel of vestiging), optioneel factuuradres, factuurcontact. */
export function isOnboardingInvoicingStepValid(context: CustomerContext): boolean {
  if (!isOnboardingInvoicingCaptureValid({ invoicingEmail: context.invoicingEmail })) {
    return false;
  }
  if (context.invoicingDiffersFromHeadOffice) {
    const id = (context.invoicingVestigingId ?? "").trim();
    if (!id) {
      return false;
    }
    const ve = context.onboardingVestigingen.find((x) => x.id === id);
    if (!ve || !isOnboardingVestigingCaptureComplete(ve)) {
      return false;
    }
  }
  if (
    context.addInvoicingAddressOverride &&
    !identificatieStreetAddressCaptureSchema.safeParse(invoicingAddressCapture(context)).success
  ) {
    return false;
  }
  if (
    context.invoicingUseContactPerson &&
    !identificatiePersonCaptureSchema.safeParse(
      personSubformValueToCapture(context.invoicingContactPerson),
    ).success
  ) {
    return false;
  }
  return true;
}

/** Optionele certificatie/inspectiecontacten (extras-stap). */
export function isOnboardingOptionalContactsStepValid(context: CustomerContext): boolean {
  if (context.addCertificationContactOverride) {
    const personOk = identificatiePersonCaptureSchema.safeParse(
      personSubformValueToCapture(certificationContactPersonFormValue(context)),
    ).success;
    if (!personOk) {
      return false;
    }
  }

  if (context.addCertificationSecondaryContact) {
    const personOk = identificatiePersonCaptureSchema.safeParse(
      personSubformValueToCapture(certificationSecondaryPersonFormValue(context)),
    ).success;
    if (!personOk) {
      return false;
    }
  }

  if (
    context.addCertificationSecondaryContact &&
    !canEnableCertificationSecondaryContact(context)
  ) {
    return false;
  }

  return true;
}

/** Tweede certificatie-/inspectiecontact alleen na een volledig hoofdcontact certificatie/inspectie. */
export function canEnableCertificationSecondaryContact(context: CustomerContext): boolean {
  if (!context.addCertificationContactOverride) {
    return false;
  }
  return identificatiePersonCaptureSchema.safeParse(
    personSubformValueToCapture(certificationContactPersonFormValue(context)),
  ).success;
}

/** Shown under the second cert contact optional block when {@link canEnableCertificationSecondaryContact} is false. */
export function certificationSecondaryContactDisabledHint(context: CustomerContext): string {
  if (!context.addCertificationContactOverride) {
    return "Schakel eerst ‘Contactpersoon voor certificatie en inspectie’ in.";
  }
  return "Vul eerst de contactpersoon voor certificatie en inspectie volledig in (naam en geldig e-mailadres).";
}

/** Bedrijfs-, facturatie- en optionele certificatiecontacten samen (voor samenvatting / guards). */
export function isOnboardingCompanyStepValid(
  context: CustomerContext,
  certificationInquiryDraftIds: readonly string[],
): boolean {
  return (
    isOnboardingCompanyCoreStepValid(context, certificationInquiryDraftIds) &&
    isOnboardingInvoicingStepValid(context) &&
    isOnboardingOptionalContactsStepValid(context)
  );
}

const INITIAL_VAT_PROTOTYPE_PRESET =
  findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;

export const DEFAULT_CONTEXT: CustomerContext = {
  ...getPersonContextFieldsForPrototypePreset(INITIAL_VAT_PROTOTYPE_PRESET),
  organizationName: "",
  country: "",
  vatNumber: INITIAL_VAT_PROTOTYPE_PRESET.vatNumber,
  addressStreet: "",
  addressHouseNumber: "",
  addressPostalCode: "",
  addressCity: "",
  addressCountryCode: "",
  firmaPhone: "",
  legalRepresentativePhone: "",
  applicantIsLegalRepresentative: "",
  registrantPerson: emptyIdentificatiePersonState(),
  registrantTitlePreset: "none",
  registrantTitle: "",
  registrantRolePreset: "none",
  registrantRole: "",
  addCertificationContactOverride: false,
  certificationContact: emptyIdentificatiePersonState(),
  certificationContactTitlePreset: "none",
  certificationContactTitle: "",
  certificationContactRolePreset: "none",
  certificationContactRole: "",
  addCertificationSecondaryContact: false,
  certificationSecondary: emptyIdentificatiePersonState(),
  certificationSecondaryTitlePreset: "none",
  certificationSecondaryTitle: "",
  certificationSecondaryRolePreset: "none",
  certificationSecondaryRole: "",
  addInvoicingSupplementaryDetails: false,
  invoicingContactOrDepartment: "",
  invoicingUseContactPerson: false,
  invoicingContactPerson: emptyIdentificatiePersonState(),
  invoicingEmail: "",
  invoicingDiffersFromHeadOffice: false,
  invoicingVestigingId: "",
  addInvoicingAddressOverride: false,
  invoicingAddressStreet: "",
  invoicingAddressHouseNumber: "",
  invoicingAddressPostalCode: "",
  invoicingAddressCity: "",
  invoicingCountry: "",
  invoicingAddressCountryCode: "",
  invoicingContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
  onboardingRegisteredPersons: [],
  certificationContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
  certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
  onboardingVestigingen: [],
  certificationInquiryVestigingId: {},
  headOfficeIsCertificationLegalEntity: "",
};

function mergeNestedDefaults(out: CustomerContext): CustomerContext {
  return {
    ...out,
    certificationContact: {
      ...DEFAULT_CONTEXT.certificationContact,
      ...out.certificationContact,
    },
    certificationSecondary: {
      ...DEFAULT_CONTEXT.certificationSecondary,
      ...out.certificationSecondary,
    },
    invoicingContactPerson: {
      ...DEFAULT_CONTEXT.invoicingContactPerson,
      ...out.invoicingContactPerson,
    },
    registrantPerson: {
      ...DEFAULT_CONTEXT.registrantPerson,
      ...out.registrantPerson,
    },
  };
}

export function normalizeCustomerContext(
  ctx: Partial<CustomerContext> & {
    representativeName?: string;
    kycNotes?: string;
    address?: string;
  },
): CustomerContext {
  const { representativeName: _legacyName, ...rest } = ctx;
  const sanitized: Record<string, unknown> = { ...rest };
  const legacyAddress = typeof sanitized.address === "string" ? sanitized.address.trim() : "";
  delete sanitized.kycNotes;
  delete sanitized.address;
  delete sanitized.addInvoicingDetails;

  const flat = sanitized as Partial<CustomerContext>;
  const out: CustomerContext = mergeNestedDefaults({
    ...DEFAULT_CONTEXT,
    ...flat,
  });

  if (
    _legacyName?.trim() &&
    !String(sanitized.representativeFirstName ?? "").trim() &&
    !String(sanitized.representativeLastName ?? "").trim()
  ) {
    const parts = _legacyName.trim().split(/\s+/);
    out.representativeFirstName = parts[0] ?? "";
    out.representativeLastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  }

  if (
    legacyAddress &&
    !(out.addressStreet?.trim() ?? "") &&
    !(out.addressHouseNumber?.trim() ?? "") &&
    !(out.addressPostalCode?.trim() ?? "") &&
    !(out.addressCity?.trim() ?? "")
  ) {
    out.addressStreet = legacyAddress;
  }

  if (!out.representativeTitlePreset) {
    out.representativeTitlePreset = "none";
  }
  if (out.representativeTitle == null) {
    out.representativeTitle = "";
  }
  if (!out.representativeRolePreset) {
    out.representativeRolePreset = "none";
  }
  if (!out.representativeRole?.trim()) {
    out.representativeRole =
      out.representativeRolePreset === "other"
        ? ""
        : out.representativeRolePreset === "none"
          ? ""
          : roleLabelForPresetId(out.representativeRolePreset);
  }

  if (!out.registrantTitlePreset) {
    out.registrantTitlePreset = "none";
  }
  if (out.registrantTitle == null) {
    out.registrantTitle = "";
  }
  const registrantTitleTrim = out.registrantTitle.trim();
  if (!registrantTitleTrim && out.registrantPerson?.title?.trim()) {
    out.registrantTitle = out.registrantPerson.title.trim();
  }
  if (!out.registrantRolePreset) {
    out.registrantRolePreset = "none";
  }
  if (!out.registrantRole?.trim()) {
    out.registrantRole =
      out.registrantRolePreset === "other"
        ? ""
        : out.registrantRolePreset === "none"
          ? ""
          : roleLabelForPresetId(out.registrantRolePreset);
  }

  if (!out.certificationContactTitlePreset) {
    out.certificationContactTitlePreset = "none";
  }
  if (out.certificationContactTitle == null) {
    out.certificationContactTitle = "";
  }
  const certContactTitleTrim = out.certificationContactTitle.trim();
  if (!certContactTitleTrim && out.certificationContact?.title?.trim()) {
    out.certificationContactTitle = out.certificationContact.title.trim();
  }
  if (!out.certificationContactRolePreset) {
    out.certificationContactRolePreset = "none";
  }
  if (!out.certificationContactRole?.trim()) {
    out.certificationContactRole =
      out.certificationContactRolePreset === "other"
        ? ""
        : out.certificationContactRolePreset === "none"
          ? ""
          : roleLabelForPresetId(out.certificationContactRolePreset);
  }

  if (!out.certificationSecondaryTitlePreset) {
    out.certificationSecondaryTitlePreset = "none";
  }
  if (out.certificationSecondaryTitle == null) {
    out.certificationSecondaryTitle = "";
  }
  const certSecondaryTitleTrim = out.certificationSecondaryTitle.trim();
  if (!certSecondaryTitleTrim && out.certificationSecondary?.title?.trim()) {
    out.certificationSecondaryTitle = out.certificationSecondary.title.trim();
  }
  if (!out.certificationSecondaryRolePreset) {
    out.certificationSecondaryRolePreset = "none";
  }
  if (!out.certificationSecondaryRole?.trim()) {
    out.certificationSecondaryRole =
      out.certificationSecondaryRolePreset === "other"
        ? ""
        : out.certificationSecondaryRolePreset === "none"
          ? ""
          : roleLabelForPresetId(out.certificationSecondaryRolePreset);
  }

  if (out.representativeTitlePreset === "none") out.representativeTitle = "";
  if (out.representativeRolePreset === "none") out.representativeRole = "";
  if (out.registrantTitlePreset === "none") {
    out.registrantTitle = "";
    out.registrantPerson = { ...out.registrantPerson, title: "" };
  }
  if (out.registrantRolePreset === "none") out.registrantRole = "";
  if (out.certificationContactTitlePreset === "none") {
    out.certificationContactTitle = "";
    out.certificationContact = { ...out.certificationContact, title: "" };
  }
  if (out.certificationContactRolePreset === "none") out.certificationContactRole = "";
  if (out.certificationSecondaryTitlePreset === "none") {
    out.certificationSecondaryTitle = "";
    out.certificationSecondary = { ...out.certificationSecondary, title: "" };
  }
  if (out.certificationSecondaryRolePreset === "none") out.certificationSecondaryRole = "";

  const applicantRel = out.applicantIsLegalRepresentative;
  if (applicantRel !== "yes" && applicantRel !== "no" && applicantRel !== "") {
    out.applicantIsLegalRepresentative = "";
  }

  if (typeof out.addCertificationContactOverride !== "boolean") {
    out.addCertificationContactOverride = DEFAULT_CONTEXT.addCertificationContactOverride;
  }
  if (typeof out.addCertificationSecondaryContact !== "boolean") {
    out.addCertificationSecondaryContact = DEFAULT_CONTEXT.addCertificationSecondaryContact;
  }
  if (typeof out.addInvoicingSupplementaryDetails !== "boolean") {
    out.addInvoicingSupplementaryDetails = DEFAULT_CONTEXT.addInvoicingSupplementaryDetails;
  }
  if (typeof out.invoicingUseContactPerson !== "boolean") {
    out.invoicingUseContactPerson = DEFAULT_CONTEXT.invoicingUseContactPerson;
  }
  if (typeof out.addInvoicingAddressOverride !== "boolean") {
    out.addInvoicingAddressOverride = DEFAULT_CONTEXT.addInvoicingAddressOverride;
  }
  /** Removed from UI: strip persisted values so old sessions stay consistent. */
  out.addInvoicingSupplementaryDetails = false;
  out.invoicingContactOrDepartment = "";
  if (!out.addCertificationContactOverride) {
    out.addCertificationSecondaryContact = false;
    out.certificationSecondaryPersonRegistryId = ONBOARDING_PERSON_NEW_ID;
  }
  if (out.firmaPhone == null) out.firmaPhone = "";
  if (out.legalRepresentativePhone == null) out.legalRepresentativePhone = "";
  if (out.addressCountryCode == null) out.addressCountryCode = "";
  if (out.invoicingContactOrDepartment == null) out.invoicingContactOrDepartment = "";
  if (out.invoicingEmail == null) out.invoicingEmail = "";
  if (out.invoicingAddressStreet == null) out.invoicingAddressStreet = "";
  if (out.invoicingAddressHouseNumber == null) out.invoicingAddressHouseNumber = "";
  if (out.invoicingAddressPostalCode == null) out.invoicingAddressPostalCode = "";
  if (out.invoicingAddressCity == null) out.invoicingAddressCity = "";
  if (out.invoicingCountry == null) out.invoicingCountry = "";
  if (out.invoicingAddressCountryCode == null) out.invoicingAddressCountryCode = "";

  out.onboardingRegisteredPersons = Array.isArray(out.onboardingRegisteredPersons)
    ? out.onboardingRegisteredPersons
    : DEFAULT_CONTEXT.onboardingRegisteredPersons;

  out.headOfficeIsCertificationLegalEntity =
    out.headOfficeIsCertificationLegalEntity === "yes" ||
    out.headOfficeIsCertificationLegalEntity === "no" ||
    out.headOfficeIsCertificationLegalEntity === ""
      ? out.headOfficeIsCertificationLegalEntity
      : "";
  out.onboardingVestigingen = Array.isArray(out.onboardingVestigingen)
    ? out.onboardingVestigingen.map((v) => ({
        ...emptyOnboardingVestiging(v?.id),
        ...v,
        id: typeof v?.id === "string" && v.id.trim() ? v.id.trim() : newOnboardingVestigingId(),
      }))
    : DEFAULT_CONTEXT.onboardingVestigingen;

  out.certificationInquiryVestigingId =
    out.certificationInquiryVestigingId != null &&
    typeof out.certificationInquiryVestigingId === "object" &&
    !Array.isArray(out.certificationInquiryVestigingId)
      ? { ...(out.certificationInquiryVestigingId as Record<string, string>) }
      : DEFAULT_CONTEXT.certificationInquiryVestigingId;

  const vestIds = new Set(out.onboardingVestigingen.map((v) => v.id));
  const prunedMap: Record<string, string> = {};
  for (const [did, vid] of Object.entries(out.certificationInquiryVestigingId)) {
    const v = typeof vid === "string" ? vid.trim() : "";
    if (v && vestIds.has(v)) prunedMap[did] = v;
  }
  out.certificationInquiryVestigingId = prunedMap;

  if (typeof out.invoicingDiffersFromHeadOffice !== "boolean") {
    out.invoicingDiffersFromHeadOffice = DEFAULT_CONTEXT.invoicingDiffersFromHeadOffice;
  }
  if (out.invoicingVestigingId == null) {
    out.invoicingVestigingId = "";
  }
  let invoicingVestId = out.invoicingVestigingId.trim();
  if (!out.invoicingDiffersFromHeadOffice) {
    invoicingVestId = "";
  } else if (invoicingVestId && !vestIds.has(invoicingVestId)) {
    invoicingVestId = "";
  }
  out.invoicingVestigingId = invoicingVestId;

  const fixRegistrySlotId = (raw: unknown, validIds: Set<string>): string => {
    const s = typeof raw === "string" ? raw.trim() : "";
    if (!s || s === ONBOARDING_PERSON_NEW_ID) {
      return ONBOARDING_PERSON_NEW_ID;
    }
    return validIds.has(s) ? s : ONBOARDING_PERSON_NEW_ID;
  };

  const preValid = new Set(out.onboardingRegisteredPersons.map((p) => p.id));
  out.invoicingContactPersonRegistryId = fixRegistrySlotId(
    out.invoicingContactPersonRegistryId,
    preValid,
  );
  out.certificationContactPersonRegistryId = fixRegistrySlotId(
    out.certificationContactPersonRegistryId,
    preValid,
  );
  out.certificationSecondaryPersonRegistryId = fixRegistrySlotId(
    out.certificationSecondaryPersonRegistryId,
    preValid,
  );

  const synced = syncOnboardingRegisteredPersons(mergeNestedDefaults(out));
  const postValid = new Set(synced.onboardingRegisteredPersons.map((p) => p.id));
  const merged = mergeNestedDefaults({
    ...synced,
    invoicingContactPersonRegistryId: fixRegistrySlotId(
      synced.invoicingContactPersonRegistryId,
      postValid,
    ),
    certificationContactPersonRegistryId: fixRegistrySlotId(
      synced.certificationContactPersonRegistryId,
      postValid,
    ),
    certificationSecondaryPersonRegistryId: fixRegistrySlotId(
      synced.certificationSecondaryPersonRegistryId,
      postValid,
    ),
  });

  if (merged.addCertificationSecondaryContact && !canEnableCertificationSecondaryContact(merged)) {
    return mergeNestedDefaults({
      ...merged,
      addCertificationSecondaryContact: false,
      certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
    });
  }

  return merged;
}

/** Safe context for render and writes: fills missing keys from persistence (first paint before effects). */
export function resolveFlowContext(
  raw: Partial<CustomerContext> & {
    representativeName?: string;
    kycNotes?: string;
    address?: string;
  },
): CustomerContext {
  const definedOnly = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined && v !== null),
  ) as Partial<CustomerContext> & {
    representativeName?: string;
    kycNotes?: string;
    address?: string;
  };
  return normalizeCustomerContext({
    ...DEFAULT_CONTEXT,
    ...definedOnly,
  });
}

export function onboardingReviewRequesterFromContext(
  context: CustomerContext,
): RequestPackageReviewRequesterPresentation {
  const extra = context.firmaPhone.trim() ? (
    <>
      <p className="text-muted-foreground">Telefoon firma</p>
      <p>{context.firmaPhone}</p>
    </>
  ) : null;

  const submittedByName =
    context.applicantIsLegalRepresentative === "no"
      ? formatRegistrantDisplayName(context)
      : formatRequesterDisplayName(context);
  const submittedByEmail =
    context.applicantIsLegalRepresentative === "no"
      ? context.registrantPerson.email.trim()
      : context.representativeEmail.trim();

  return {
    context: {
      requesterName: submittedByName,
      requesterEmail: submittedByEmail,
      organizationName: context.organizationName,
      organizationDetails: (
        <>
          {context.applicantIsLegalRepresentative === "no" ? (
            <>
              <p className="text-sm font-medium text-foreground">Wettelijke vertegenwoordiger</p>
              <p>{formatRequesterDisplayName(context)}</p>
              <p className="text-sm text-muted-foreground">{context.representativeEmail}</p>
              {context.legalRepresentativePhone.trim() ? (
                <p className="text-sm text-muted-foreground">{context.legalRepresentativePhone}</p>
              ) : null}
            </>
          ) : null}
          <p>{context.vatNumber}</p>
          <p>{formatPostalAddressDisplay(context)}</p>
          {extra}
        </>
      ),
    },
    sectionTitle: "Aanvrager en organisatie",
    requesterLabel: "Ingediend door",
    requesterEmailLabel: "E-mail",
    organizationLabel: "Organisatie",
  };
}

export function buildRows(
  context: CustomerContext,
  drafts: readonly CertificationRequestDraft[],
  includedDraftIds: readonly string[],
  options?: { includeDraftRows?: boolean },
): RequestPackageRow[] {
  const includeDraftRows = options?.includeDraftRows !== false;
  const rows: RequestPackageRow[] = [
    { id: "role", label: "Rol", value: context.representativeRole.trim() || "—" },
    { id: "country", label: "Land", value: context.country },
    { id: "address", label: "Adres firma", value: formatPostalAddressDisplay(context) },
  ];

  if (context.firmaPhone.trim()) {
    rows.push({ id: "firma-phone", label: "Telefoon firma", value: context.firmaPhone });
  }

  if (context.legalRepresentativePhone.trim()) {
    rows.push({
      id: "rep-phone",
      label: "Telefoon vertegenwoordiger",
      value: context.legalRepresentativePhone,
    });
  }

  const invoicingLegalEntityValue = (() => {
    if (context.invoicingDiffersFromHeadOffice) {
      const id = (context.invoicingVestigingId ?? "").trim();
      const ve = id ? context.onboardingVestigingen.find((x) => x.id === id) : undefined;
      if (ve && isOnboardingVestigingCaptureComplete(ve)) {
        return `${ve.legalName.trim()} · ${formatOnboardingVestigingPostalLine(ve)}`;
      }
      return ve
        ? `${ve.legalName.trim() || "Onvolledig"} · adres nog aan te vullen`
        : "—";
    }
    return `${context.organizationName.trim() || "—"} · ${formatPostalAddressDisplay(context)}`;
  })();
  rows.push({
    id: "invoicing-legal-entity",
    label: "Facturatie (rechtspersoon)",
    value: invoicingLegalEntityValue,
  });

  {
    const invPersonValue = context.invoicingUseContactPerson
      ? context.invoicingContactPerson
      : legalRepresentativePersonValue(context);
    const c = personSubformValueToCapture(invPersonValue);
    rows.push({
      id: "invoicing-contact-person",
      label: "Contact facturatie",
      value: `${c.name} · ${c.email}${
        context.invoicingUseContactPerson ? "" : " · wettelijke vertegenwoordiger"
      }`,
    });
  }

  rows.push({
    id: "invoicing",
    label: "Facturatie",
    value: context.invoicingEmail.trim() || "—",
  });

  if (context.addCertificationContactOverride) {
    const c = personSubformValueToCapture(certificationContactPersonFormValue(context));
    rows.push({
      id: "cert-primary",
      label: "Contact certificatie en inspectie",
      value: `${c.name} · ${c.email}`,
    });
  }

  if (context.addCertificationSecondaryContact) {
    const c = personSubformValueToCapture(certificationSecondaryPersonFormValue(context));
    rows.push({
      id: "cert-secondary",
      label: "Tweede contact certificatie en inspectie",
      value: `${c.name} · ${c.email}`,
    });
  }
  if (
    context.addInvoicingAddressOverride &&
    identificatieStreetAddressCaptureSchema.safeParse(invoicingAddressCapture(context)).success
  ) {
    const cap = invoicingAddressCapture(context);
    rows.push({
      id: "invoicing-address",
      label: "Facturatieadres",
      value: `${cap.street} ${cap.houseNumber}, ${cap.postalCode} ${cap.locality} — ${cap.countryLabel}`,
    });
  }

  if (includeDraftRows) {
    const included = drafts.filter((d) => includedDraftIds.includes(d.id));
    included.forEach((draft, index) => {
      rows.push({
        id: draft.id,
        label: `Aanvraag ${index + 1}`,
        value: draft.productLabel ? `${draft.label} · ${draft.productLabel}` : draft.label,
      });
      if (context.headOfficeIsCertificationLegalEntity === "no") {
        const vid = (context.certificationInquiryVestigingId[draft.id] ?? "").trim();
        const ve = vid ? context.onboardingVestigingen.find((x) => x.id === vid) : undefined;
        rows.push({
          id: `${draft.id}-vestiging`,
          label: `Vestiging (aanvraag ${index + 1})`,
          value:
            ve !== undefined && isOnboardingVestigingCaptureComplete(ve)
              ? `${ve.legalName.trim()} · ${formatOnboardingVestigingPostalLine(ve)}`
              : ve !== undefined
                ? `${ve.legalName.trim() || "Onvolledig"} · adres nog aan te vullen`
                : "—",
        });
      }
    });
  }

  return rows;
}

export function firmaAddressSubformValue(
  context: CustomerContext,
): IdentificatieAddressSubformValue {
  return {
    street: context.addressStreet,
    houseNumber: context.addressHouseNumber,
    postalCode: context.addressPostalCode,
    locality: context.addressCity,
    country: context.country,
    countryCode: context.addressCountryCode,
  };
}

export function invoicingAddressSubformValue(
  context: CustomerContext,
): IdentificatieAddressSubformValue {
  return {
    street: context.invoicingAddressStreet,
    houseNumber: context.invoicingAddressHouseNumber,
    postalCode: context.invoicingAddressPostalCode,
    locality: context.invoicingAddressCity,
    country: context.invoicingCountry,
    countryCode: context.invoicingAddressCountryCode,
  };
}

export function stepIndex(step: OnboardingStep) {
  return ONBOARDING_STEPS.indexOf(step);
}

export function readInitialCompanyLookupPhase(): "idle" | "loading" | "ready" {
  if (typeof localStorage === "undefined") return "idle";
  try {
    const raw = localStorage.getItem(ONBOARDING_FLOW_STORAGE_KEY);
    if (!raw) return "idle";
    const parsed = JSON.parse(raw) as { step?: string };
    const s = parsed.step;
    return s === "company" || s === "kyc" ? "loading" : "idle";
  } catch {
    return "idle";
  }
}
