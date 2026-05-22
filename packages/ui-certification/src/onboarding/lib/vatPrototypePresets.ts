/** Preset list for demos only — in production the user enters their own identifier. */
import type { PersonPreferredLanguage } from "@procertus-ui/domain-certification";
import { roleLabelForPresetId, titleLabelForPresetId } from "./registrationPersonOptions";

export type VatLookupMockOutcome = "registry_auto" | "prefix_only" | "manual";

export const VAT_LOOKUP_OUTCOME_LABELS: Record<VatLookupMockOutcome, string> = {
  registry_auto: "Automatisch uit register",
  prefix_only: "Deels automatisch",
  manual: "Handmatig aanvullen",
};

/** ISO 3166-1 alpha-2 prefix as used on VAT IDs, plus common extras (display names NL). */
const VAT_PREFIX_TO_COUNTRY_NL: Record<string, string> = {
  AT: "Oostenrijk",
  BE: "België",
  BG: "Bulgarije",
  CY: "Cyprus",
  CZ: "Tsjechië",
  DE: "Duitsland",
  DK: "Denemarken",
  EE: "Estland",
  EL: "Griekenland",
  ES: "Spanje",
  FI: "Finland",
  FR: "Frankrijk",
  GB: "Verenigd Koninkrijk",
  GR: "Griekenland",
  HR: "Kroatië",
  HU: "Hongarije",
  IE: "Ierland",
  IT: "Italië",
  LT: "Litouwen",
  LU: "Luxemburg",
  LV: "Letland",
  MT: "Malta",
  NL: "Nederland",
  PL: "Polen",
  PT: "Portugal",
  RO: "Roemenië",
  SE: "Zweden",
  SI: "Slovenië",
  SK: "Slowakije",
  US: "Verenigde Staten",
  XI: "Noord-Ierland",
};

const DUTCH_COUNTRY_LABEL_TO_ISO: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const [iso, label] of Object.entries(VAT_PREFIX_TO_COUNTRY_NL)) {
    if (m[label] === undefined) m[label] = iso;
  }
  return m;
})();

/** ISO 3166-1 alpha-2 for a Dutch UI country label from {@link REGISTRATION_COUNTRY_OPTIONS}, or `""`. */
export function registrationIsoCodeFromDutchCountryLabel(countryLabel: string): string {
  const t = countryLabel.trim();
  if (!t) return "";
  return DUTCH_COUNTRY_LABEL_TO_ISO[t] ?? "";
}

/**
 * Derives the country of origin from a syntactically plausible VAT-style identifier
 * (leading ISO-style alpha-2, e.g. BE, NL, DE, FR, US).
 */
export function deriveCountryFromVat(raw: string): string {
  const normalized = raw.trim().toUpperCase().replace(/\s+/g, " ");
  if (!normalized) return "";
  const compact = normalized.replace(/\s/g, "");
  const pair = compact.match(/^([A-Z]{2})/);
  if (pair) {
    const code = pair[1];
    return VAT_PREFIX_TO_COUNTRY_NL[code] ?? "";
  }
  return "";
}

/** Nederlands‑talige landnamen voor registratie (afgeleid uit btw‑prefixset). Alfabetisch gesorteerd. */
export const REGISTRATION_COUNTRY_OPTIONS: readonly string[] = Array.from(
  new Set(Object.values(VAT_PREFIX_TO_COUNTRY_NL)),
).sort((a, b) => a.localeCompare(b, "nl"));

const REGISTER_FIELD_HELPER =
  "Vooraf ingevuld uit openbare gegevens. Controleer en pas aan indien nodig.";

function domainFieldHelper(): string {
  return "Aangevuld aan de hand van uw professionele e-mailadres. Controleer of naam en adres kloppen.";
}

export type RegistrationEnrichmentHints = Partial<
  Record<"organizationName" | "addressStreet" | "country", string>
>;

export type RegistrationEnrichmentResult = {
  organizationName: string;
  country: string;
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
  hints: RegistrationEnrichmentHints;
};

/** Stages shown while a lookup runs (mirrors real checks at a high level). */
export const VAT_LOOKUP_SIMULATION_STEPS: readonly { id: string; label: string }[] = [
  { id: "vies", label: "Btw-registratie verifiëren bij VIES" },
  { id: "registry", label: "Zoeken in de Kruispuntbank van Ondernemingen" },
  { id: "entity", label: "Bedrijfs- en adresgegevens ophalen" },
];

const GENERIC_ORG_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "msn.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
]);

function hostnameFromEmail(email: string): string {
  const at = email.trim().lastIndexOf("@");
  if (at <= 0 || at === email.length - 1) return "";
  return email
    .slice(at + 1)
    .trim()
    .toLowerCase();
}

/**
 * Mock “server” response: company data keyed by full registrable host (not TLD alone).
 * In production this would call backend services (WHOIS, brand DB, …).
 */
const MOCK_DOMAIN_COMPANY_BY_HOST: Record<
  string,
  {
    organizationName: string;
    addressStreet?: string;
    addressHouseNumber?: string;
    addressPostalCode?: string;
    addressCity?: string;
  }
> = {
  "industrialpackaging.be": {
    organizationName: "Industrial Packaging NV",
    addressStreet: "Industrielaan",
    addressHouseNumber: "12",
    addressPostalCode: "9000",
    addressCity: "Gent",
  },
  "demofoods.be": {
    organizationName: "Demo Foods BV",
    addressStreet: "Nationalestraat",
    addressHouseNumber: "5",
    addressPostalCode: "2000",
    addressCity: "Antwerpen",
  },
  "deltapackaging.nl": {
    organizationName: "Demo Delta Packaging B.V.",
    addressStreet: "Keizersgracht",
    addressHouseNumber: "100",
    addressPostalCode: "1015 CW",
    addressCity: "Amsterdam",
  },
  "packline-industry.de": {
    organizationName: "PackLine Industry GmbH",
    addressStreet: "Industriestraße",
    addressHouseNumber: "47",
    addressPostalCode: "80339",
    addressCity: "München",
  },
  "packline-industry.fr": {
    organizationName: "PackLine Industry SARL",
    addressStreet: "Rue de la Logistique",
    addressHouseNumber: "8",
    addressPostalCode: "69002",
    addressCity: "Lyon",
  },
  "packline-industry.com": {
    organizationName: "PackLine Industry Inc.",
    addressStreet: "Harbor Logistics Way",
    addressHouseNumber: "2100",
    addressPostalCode: "60607",
    addressCity: "Chicago",
  },
};

export type DomainCompanyLookupResult = {
  organizationName: string;
  addressStreet?: string;
  addressHouseNumber?: string;
  addressPostalCode?: string;
  addressCity?: string;
  /** Registrable host that matched (after trying subdomains → apex). */
  matchedHost: string;
};

/** Used when the scenario has no register org/address: demo always pre-fills from this fixed “domain lookup” row. */
const DEMO_EMAIL_DOMAIN_COMPANY_DEFAULT: DomainCompanyLookupResult = {
  organizationName: "Industrial Packaging NV",
  addressStreet: "Industrielaan",
  addressHouseNumber: "12",
  addressPostalCode: "9000",
  addressCity: "Gent",
  matchedHost: "industrialpackaging.be",
};

const DEMO_DOMAIN_MOCK_FIELD_HELPER =
  "Voorbeeldgegevens om het formulier te tonen. Vervang ze door uw echte gegevens en controleer alles.";

function hostVariantsForLookup(host: string): string[] {
  const parts = host.split(".").filter(Boolean);
  if (parts.length < 2) return [];
  const variants: string[] = [];
  for (let i = 0; i <= parts.length - 2; i++) {
    variants.push(parts.slice(i).join("."));
  }
  return variants;
}

/**
 * Resolves the e-mail host to an apex / registrable domain and returns mock company data when available.
 * Does not infer country — use validated VAT for that.
 */
export function lookupCompanyByEmailDomain(email: string): DomainCompanyLookupResult | null {
  const host = hostnameFromEmail(email);
  if (!host || GENERIC_ORG_EMAIL_DOMAINS.has(host)) return null;

  const last = host.split(".").pop() ?? "";
  if (["example", "localhost", "test", "invalid"].includes(last)) return null;

  for (const candidate of hostVariantsForLookup(host)) {
    const row = MOCK_DOMAIN_COMPANY_BY_HOST[candidate];
    if (row) {
      return {
        organizationName: row.organizationName,
        addressStreet: row.addressStreet,
        addressHouseNumber: row.addressHouseNumber,
        addressPostalCode: row.addressPostalCode,
        addressCity: row.addressCity,
        matchedHost: candidate,
      };
    }
  }
  return null;
}

type DomainHitSource = "email_host_mock" | "demo_default_mock";

/**
 * Mock domain → company resolution. For FR/DE/US-style presets (`demoSupplementsOrgAddressFromEmailDomain`),
 * always returns a row so company name and address pre-fill without real e-mail parsing.
 */
function resolveMockDomainCompanyForEnrichment(
  email: string,
  preset: VatPrototypePreset,
): { hit: DomainCompanyLookupResult; source: DomainHitSource } | null {
  const fromLookup = lookupCompanyByEmailDomain(email);
  if (fromLookup) {
    return { hit: fromLookup, source: "email_host_mock" };
  }
  if (preset.demoSupplementsOrgAddressFromEmailDomain) {
    return { hit: DEMO_EMAIL_DOMAIN_COMPANY_DEFAULT, source: "demo_default_mock" };
  }
  return null;
}

/** Demo-only indiener (persoon die het formulier invult) wanneer ≠ wettelijk vertegenwoordiger. */
export type VatPrototypeDemoRegistrant = {
  firstName: string;
  lastName: string;
  registrantTitlePreset: string;
  /** Alleen wanneer `registrantTitlePreset === "other"` */
  registrantTitle: string;
  telephone: string;
  email: string;
  registrantRolePreset: string;
  /** Alleen wanneer `registrantRolePreset === "other"` */
  registrantRoleCustom?: string;
};

/** Demo-only vertegenwoordiger gekoppeld aan een voorbeeld-btw-scenario en bijhorend mock e-maildomein. */
export type VatPrototypeDemoPerson = {
  representativeFirstName: string;
  representativeLastName: string;
  representativeTitlePreset: string;
  /** Alleen gebruikt wanneer `representativeTitlePreset === "other"` */
  representativeTitle: string;
  representativeEmail: string;
  representativeRolePreset: string;
  /** Alleen gebruikt wanneer `representativeRolePreset === "other"` */
  representativeRoleCustom?: string;
};

export type VatPrototypePreset = {
  id: string;
  label: string;
  vatNumber: string;
  /** Shown after the mock lookup finishes */
  outcomeMessage: string;
  outcomeLabel: string;
  /**
   * Demo: het register levert hier geen bedrijfsnaam noch vestigingsadres; naam en adres
   * worden in de flow aangevuld via het registratiedomein van het e-mailadres (mock), indien bekend.
   */
  demoSupplementsOrgAddressFromEmailDomain: boolean;
  /** Prefilled wettelijke vertegenwoordiger + e-mail (mock); e-maildomein zit in {@link MOCK_DOMAIN_COMPANY_BY_HOST} waar mogelijk. */
  demoPerson: VatPrototypeDemoPerson;
  /**
   * Demo: tweede persoon (indiener) per scenario — uiteenlopende landen/formaten voor snelle demos
   * wanneer de gebruiker aangeeft niet de wettelijke vertegenwoordiger te zijn.
   */
  demoRegistrant: VatPrototypeDemoRegistrant;
  mock: {
    outcome: VatLookupMockOutcome;
    organizationName: string;
    /** Used only when the prefix cannot be mapped to a country */
    countryFallback: string;
    addressStreet: string;
    addressHouseNumber: string;
    addressPostalCode: string;
    addressCity: string;
  };
};

export function getPersonContextFieldsForPrototypePreset(preset: VatPrototypePreset): {
  representativeFirstName: string;
  representativeLastName: string;
  representativeTitlePreset: string;
  representativeTitle: string;
  representativeEmail: string;
  representativeLanguage: PersonPreferredLanguage;
  representativeRolePreset: string;
  representativeRole: string;
} {
  const p = preset.demoPerson;
  const titlePreset = p.representativeTitlePreset;
  const rolePreset = p.representativeRolePreset;
  const representativeTitle =
    titlePreset === "other"
      ? p.representativeTitle
      : titlePreset === "none"
        ? ""
        : titleLabelForPresetId(titlePreset);
  const representativeRole =
    rolePreset === "other"
      ? (p.representativeRoleCustom ?? "")
      : rolePreset === "none"
        ? ""
        : roleLabelForPresetId(rolePreset);
  return {
    representativeFirstName: p.representativeFirstName,
    representativeLastName: p.representativeLastName,
    representativeTitlePreset: titlePreset,
    representativeTitle,
    representativeEmail: p.representativeEmail,
    representativeLanguage: "nl",
    representativeRolePreset: rolePreset,
    representativeRole,
  };
}

/**
 * Zelfde resolutieregels als {@link getPersonContextFieldsForPrototypePreset}, voor het indiener-blok.
 */
export function getRegistrantContextFieldsForPrototypePreset(preset: VatPrototypePreset): {
  registrantPerson: {
    firstName: string;
    lastName: string;
    title: string;
    telephone: string;
    email: string;
    language: PersonPreferredLanguage;
  };
  registrantTitlePreset: string;
  registrantTitle: string;
  registrantRolePreset: string;
  registrantRole: string;
} {
  const r = preset.demoRegistrant;
  const titlePreset = r.registrantTitlePreset;
  const rolePreset = r.registrantRolePreset;
  const registrantTitle =
    titlePreset === "other"
      ? r.registrantTitle
      : titlePreset === "none"
        ? ""
        : titleLabelForPresetId(titlePreset);
  const registrantRole =
    rolePreset === "other"
      ? (r.registrantRoleCustom ?? "")
      : rolePreset === "none"
        ? ""
        : roleLabelForPresetId(rolePreset);
  return {
    registrantPerson: {
      firstName: r.firstName,
      lastName: r.lastName,
      title: registrantTitle,
      telephone: r.telephone,
      email: r.email,
      language: "nl",
    },
    registrantTitlePreset: titlePreset,
    registrantTitle,
    registrantRolePreset: rolePreset,
    registrantRole,
  };
}

/**
 * For presets where the register does not return org name/address in the demo, emphasize
 * that the loading UI reflects domain-based supplementation (mock).
 */
export function vatLookupSimulationStepsForPreset(
  preset: VatPrototypePreset,
): readonly { id: string; label: string }[] {
  if (!preset.demoSupplementsOrgAddressFromEmailDomain) {
    return VAT_LOOKUP_SIMULATION_STEPS;
  }
  return VAT_LOOKUP_SIMULATION_STEPS.map((step) => {
    if (step.id === "entity") {
      return {
        ...step,
        label: "Bedrijfsnaam en adres ingevuld aan de hand van uw e-mailadres",
      };
    }
    return step;
  });
}

export type RegistrationEnrichmentInput = {
  vatNumber: string;
  representativeEmail: string;
  preset: VatPrototypePreset;
  /**
   * When true, firma‑land is fixed by "Land of regio" (BE/NL/US); copy must not imply the user can
   * change country here or that it comes only from the registration number.
   */
  firmaCountryLocked?: boolean;
};

/**
 * Combines mock register data with country from validated VAT and optional company data
 * from a serverside domain → organization lookup (mock). Country is never taken from e-mail TLD.
 */
export function enrichRegistrationContext(
  input: RegistrationEnrichmentInput,
): RegistrationEnrichmentResult {
  const { vatNumber, representativeEmail, preset, firmaCountryLocked = false } = input;
  const vatCountry = deriveCountryFromVat(vatNumber);
  const country = vatCountry || preset.mock.countryFallback;

  const fromRegisters = {
    organizationName: preset.mock.organizationName.trim(),
    addressStreet: preset.mock.addressStreet.trim(),
    addressHouseNumber: preset.mock.addressHouseNumber.trim(),
    addressPostalCode: preset.mock.addressPostalCode.trim(),
    addressCity: preset.mock.addressCity.trim(),
  };

  const hadRegisterOrg = fromRegisters.organizationName.length > 0;
  const hadRegisterAddr = [
    fromRegisters.addressStreet,
    fromRegisters.addressHouseNumber,
    fromRegisters.addressPostalCode,
    fromRegisters.addressCity,
  ].some((s) => s.length > 0);

  let organizationName = fromRegisters.organizationName;
  let addressStreet = fromRegisters.addressStreet;
  let addressHouseNumber = fromRegisters.addressHouseNumber;
  let addressPostalCode = fromRegisters.addressPostalCode;
  let addressCity = fromRegisters.addressCity;
  let orgFromDomain = false;
  let addrFromDomain = false;

  const domainResolved = resolveMockDomainCompanyForEnrichment(representativeEmail, preset);
  const domainHit = domainResolved?.hit;
  const domainSource = domainResolved?.source;

  if (domainHit) {
    if (!hadRegisterOrg && domainHit.organizationName) {
      organizationName = domainHit.organizationName;
      orgFromDomain = true;
    } else if (!organizationName && domainHit.organizationName) {
      organizationName = domainHit.organizationName;
      orgFromDomain = true;
    }

    if (!hadRegisterAddr) {
      if (domainHit.addressStreet) {
        addressStreet = domainHit.addressStreet;
        addrFromDomain = true;
      }
      if (domainHit.addressHouseNumber) {
        addressHouseNumber = domainHit.addressHouseNumber;
        addrFromDomain = true;
      }
      if (domainHit.addressPostalCode) {
        addressPostalCode = domainHit.addressPostalCode;
        addrFromDomain = true;
      }
      if (domainHit.addressCity) {
        addressCity = domainHit.addressCity;
        addrFromDomain = true;
      }
    } else {
      if (!addressStreet && domainHit.addressStreet) {
        addressStreet = domainHit.addressStreet;
        addrFromDomain = true;
      }
      if (!addressHouseNumber && domainHit.addressHouseNumber) {
        addressHouseNumber = domainHit.addressHouseNumber;
        addrFromDomain = true;
      }
      if (!addressPostalCode && domainHit.addressPostalCode) {
        addressPostalCode = domainHit.addressPostalCode;
        addrFromDomain = true;
      }
      if (!addressCity && domainHit.addressCity) {
        addressCity = domainHit.addressCity;
        addrFromDomain = true;
      }
    }
  }

  const hints: RegistrationEnrichmentHints = {};

  if (country.trim()) {
    if (firmaCountryLocked) {
      hints.country = "Land zoals gekozen bij ‘Land of regio’. U kunt het hier niet wijzigen.";
    } else if (vatCountry) {
      hints.country = "Land afgeleid uit uw nummer. U kunt het hier nog aanpassen.";
    } else {
      hints.country = "Land ingesteld voor dit voorbeeld. Pas aan indien nodig.";
    }
  }

  const domainHintForField =
    domainSource === "demo_default_mock"
      ? DEMO_DOMAIN_MOCK_FIELD_HELPER
      : domainHit
        ? domainFieldHelper()
        : "";

  if (organizationName) {
    if (hadRegisterOrg) {
      hints.organizationName = REGISTER_FIELD_HELPER;
    } else if (orgFromDomain && domainHit && domainHintForField) {
      hints.organizationName = domainHintForField;
    }
  }

  const hasAnyAddress = [addressStreet, addressHouseNumber, addressPostalCode, addressCity].some(
    (s) => s.length > 0,
  );
  if (hasAnyAddress) {
    if (hadRegisterAddr) {
      hints.addressStreet = REGISTER_FIELD_HELPER;
    } else if (addrFromDomain && domainHit && domainHintForField) {
      hints.addressStreet = domainHintForField;
    }
  }

  return {
    organizationName,
    country,
    addressStreet,
    addressHouseNumber,
    addressPostalCode,
    addressCity,
    hints,
  };
}

/** Company-step form fields the mock lookup can pre-fill (matches onboarding context keys). */
export type CompanyFormFieldKey =
  | "organizationName"
  | "country"
  | "addressStreet"
  | "addressHouseNumber"
  | "addressPostalCode"
  | "addressCity";

/** Fields that will receive non-empty values after {@link enrichRegistrationContext} for this input. */
export function companyFormFieldsPrefilledByMockLookup(
  input: RegistrationEnrichmentInput,
): ReadonlySet<CompanyFormFieldKey> {
  const e = enrichRegistrationContext(input);
  const out = new Set<CompanyFormFieldKey>();
  if (e.organizationName.trim()) out.add("organizationName");
  if (e.country.trim()) out.add("country");
  if (e.addressStreet.trim()) out.add("addressStreet");
  if (e.addressHouseNumber.trim()) out.add("addressHouseNumber");
  if (e.addressPostalCode.trim()) out.add("addressPostalCode");
  if (e.addressCity.trim()) out.add("addressCity");
  return out;
}

/**
 * After each simulated lookup step completes (0 = vies … 2 = entity), which company fields the
 * narrative treats as resolved for loading UI. Aligns with {@link vatLookupSimulationStepsForPreset}.
 */
export function companyFormFieldsResolvedThroughLookupStep(
  completedStepIndex: number,
  input: RegistrationEnrichmentInput,
): ReadonlySet<CompanyFormFieldKey> {
  if (completedStepIndex < 0) return new Set();

  const { preset, vatNumber } = input;
  const steps = vatLookupSimulationStepsForPreset(preset);
  const resolved = new Set<CompanyFormFieldKey>();

  for (let i = 0; i <= completedStepIndex && i < steps.length; i++) {
    const id = steps[i].id;

    if (id === "vies") {
      const c = deriveCountryFromVat(vatNumber) || preset.mock.countryFallback;
      if (c.trim()) resolved.add("country");
    }

    if (id === "registry") {
      if (preset.mock.organizationName.trim()) resolved.add("organizationName");
    }

    if (id === "entity") {
      const m = preset.mock;
      if (m.addressStreet.trim()) resolved.add("addressStreet");
      if (m.addressHouseNumber.trim()) resolved.add("addressHouseNumber");
      if (m.addressPostalCode.trim()) resolved.add("addressPostalCode");
      if (m.addressCity.trim()) resolved.add("addressCity");
      if (preset.demoSupplementsOrgAddressFromEmailDomain) {
        companyFormFieldsPrefilledByMockLookup(input).forEach((k) => resolved.add(k));
      }
    }
  }

  return resolved;
}

export const VAT_PROTOTYPE_PRESETS: readonly VatPrototypePreset[] = [
  {
    id: "be-kbo",
    label: "België — voorbeeld met volledige gegevens",
    vatNumber: "BE0403.107.223",
    outcomeLabel: "Gegevens gevonden",
    outcomeMessage:
      "We vonden openbare gegevens bij dit nummer. Controleer onderstaande velden en pas ze zo nodig aan.",
    demoSupplementsOrgAddressFromEmailDomain: false,
    demoPerson: {
      representativeFirstName: "Sophie",
      representativeLastName: "Maes",
      representativeTitlePreset: "mrs",
      representativeTitle: "",
      representativeEmail: "sophie.maes@demofoods.be",
      representativeRolePreset: "managing_director",
    },
    demoRegistrant: {
      firstName: "Pieter",
      lastName: "Janssens",
      registrantTitlePreset: "mr",
      registrantTitle: "",
      telephone: "+32 475 12 34 56",
      email: "pieter.janssens@indiening-demo.be",
      registrantRolePreset: "legal_representative",
    },
    mock: {
      outcome: "registry_auto",
      organizationName: "Demo Foods BV",
      countryFallback: "",
      addressStreet: "Nationalestraat",
      addressHouseNumber: "5",
      addressPostalCode: "2000",
      addressCity: "Antwerpen",
    },
  },
  {
    id: "nl-kvk",
    label: "Nederland — voorbeeld met volledige gegevens",
    vatNumber: "NL001234567B01",
    outcomeLabel: "Gegevens gevonden",
    outcomeMessage:
      "We vonden openbare gegevens bij dit nummer. Controleer onderstaande velden en pas ze zo nodig aan.",
    demoSupplementsOrgAddressFromEmailDomain: false,
    demoPerson: {
      representativeFirstName: "Lars",
      representativeLastName: "de Vries",
      representativeTitlePreset: "ir",
      representativeTitle: "",
      representativeEmail: "lars.devries@deltapackaging.nl",
      representativeRolePreset: "technical",
    },
    demoRegistrant: {
      firstName: "Marie",
      lastName: "van den Berg",
      registrantTitlePreset: "mrs",
      registrantTitle: "",
      telephone: "+31 6 1234 5678",
      email: "marie.vandenberg@indiening-demo.nl",
      registrantRolePreset: "procurement",
    },
    mock: {
      outcome: "registry_auto",
      organizationName: "Demo Delta Packaging B.V.",
      countryFallback: "",
      addressStreet: "Keizersgracht",
      addressHouseNumber: "100",
      addressPostalCode: "1015 CW",
      addressCity: "Amsterdam",
    },
  },
  {
    id: "de-partial",
    label: "Duitsland — voorbeeld met gedeeltelijke gegevens",
    vatNumber: "DE123456789",
    outcomeLabel: "Deels automatisch",
    outcomeMessage:
      "Het land volgt uit uw nummer. We hebben geen bedrijfsnaam en volledig adres automatisch ontvangen. Waar mogelijk vullen we die voor u aan op basis van uw professionele e-mailadres; anders vult u straat, huisnummer, postcode en plaats hieronder zelf in.",
    demoSupplementsOrgAddressFromEmailDomain: true,
    demoPerson: {
      representativeFirstName: "Anna",
      representativeLastName: "Müller",
      representativeTitlePreset: "dr",
      representativeTitle: "",
      representativeEmail: "anna.mueller@packline-industry.de",
      representativeRolePreset: "legal_representative",
    },
    demoRegistrant: {
      firstName: "Thomas",
      lastName: "Weber",
      registrantTitlePreset: "other",
      registrantTitle: "Dipl.-Ing.",
      telephone: "+49 30 2211 8899",
      email: "thomas.weber@indiening-demo.de",
      registrantRolePreset: "other",
      registrantRoleCustom: "Zertifizierungsbeauftragter",
    },
    mock: {
      outcome: "prefix_only",
      organizationName: "",
      countryFallback: "",
      addressStreet: "",
      addressHouseNumber: "",
      addressPostalCode: "",
      addressCity: "",
    },
  },
  {
    id: "fr-manual",
    label: "Frankrijk — voorbeeld met handmatige aanvulling",
    vatNumber: "FR40303265045",
    outcomeLabel: "Aanvullen vereist",
    outcomeMessage:
      "Het land volgt uit uw nummer. We hebben geen bedrijfsnaam en vestigingsadres automatisch ontvangen. Waar mogelijk vullen we die aan op basis van uw e-mailadres; controleer alles en vul ontbrekende velden zelf in.",
    demoSupplementsOrgAddressFromEmailDomain: true,
    demoPerson: {
      representativeFirstName: "Camille",
      representativeLastName: "Bernard",
      representativeTitlePreset: "mrs",
      representativeTitle: "",
      representativeEmail: "camille.bernard@packline-industry.fr",
      representativeRolePreset: "sales",
    },
    demoRegistrant: {
      firstName: "Élise",
      lastName: "Dubois",
      registrantTitlePreset: "ing",
      registrantTitle: "",
      telephone: "+33 7 66 55 44 33",
      email: "elise.dubois@indiening-demo.fr",
      registrantRolePreset: "quality",
    },
    mock: {
      outcome: "manual",
      organizationName: "",
      countryFallback: "",
      addressStreet: "",
      addressHouseNumber: "",
      addressPostalCode: "",
      addressCity: "",
    },
  },
  {
    id: "us-international",
    label: "Verenigde Staten — voorbeeld buiten de EU",
    vatNumber: "US-EIN 12-3456789",
    outcomeLabel: "Aanvullen vereist",
    outcomeMessage:
      "Het land volgt uit uw nummer. Voor bedrijfsnaam en adres hadden we geen automatische gegevens. Waar mogelijk helpen we aan op basis van uw e-mailadres. Controleer en corrigeer alles voordat u verdergaat.",
    demoSupplementsOrgAddressFromEmailDomain: true,
    demoPerson: {
      representativeFirstName: "Jordan",
      representativeLastName: "Taylor",
      representativeTitlePreset: "none",
      representativeTitle: "",
      representativeEmail: "jordan.taylor@packline-industry.com",
      representativeRolePreset: "procurement",
    },
    demoRegistrant: {
      firstName: "Casey",
      lastName: "Morgan",
      registrantTitlePreset: "none",
      registrantTitle: "",
      telephone: "+1 512 555 0142",
      email: "casey.morgan@indiening-demo.com",
      registrantRolePreset: "administration",
    },
    mock: {
      outcome: "manual",
      organizationName: "",
      countryFallback: "",
      addressStreet: "",
      addressHouseNumber: "",
      addressPostalCode: "",
      addressCity: "",
    },
  },
] as const;

export const DEFAULT_VAT_PROTOTYPE_PRESET_ID = VAT_PROTOTYPE_PRESETS[0]?.id ?? "be-kbo";

export function findVatPrototypePreset(id: string): VatPrototypePreset | undefined {
  return VAT_PROTOTYPE_PRESETS.find((p) => p.id === id);
}

/** Minimal shape check before we spend a lookup — not country-specific. */
export function isVatIdentifierPlausible(raw: string): boolean {
  const v = raw.trim();
  if (v.length < 4) return false;
  const alnum = v.replace(/[\s.\-/_]/g, "");
  return alnum.length >= 4 && /[A-Za-z0-9]/.test(alnum);
}
