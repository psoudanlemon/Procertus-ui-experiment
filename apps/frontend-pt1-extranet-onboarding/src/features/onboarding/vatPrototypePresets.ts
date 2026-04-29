/** Preset list for demos only — in production the user enters their own identifier. */
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
  "Overgenomen uit het openbare register in deze demo. Controleer en pas aan indien nodig.";

function domainFieldHelper(matchedHost: string): string {
  return `Aangevuld via uw e-maildomein (${matchedHost}); serverside koppeling (mock). Controleer de gegevens.`;
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
  { id: "prefix", label: "Herkomstland afgeleid uit uw nummer" },
  { id: "vies", label: "EU-btw-informatie gecontroleerd (VIES)" },
  { id: "registry", label: "Nationale registers en publicaties doorzocht" },
  { id: "entity", label: "Bedrijfsnaam en vestigingsadres vastgesteld" },
  { id: "email", label: "Domein van uw e-mail gekoppeld aan onderneming (serverside)" },
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
  "Demo: vaste voorbeeldgegevens (mock ‘domeinlookup’, geen echte afleiding uit uw e-mail). Controleer en pas aan.";

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
  /** Prefilled registrant + e-mail (mock); e-maildomein zit in {@link MOCK_DOMAIN_COMPANY_BY_HOST} waar mogelijk. */
  demoPerson: VatPrototypeDemoPerson;
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
    rolePreset === "other" ? (p.representativeRoleCustom ?? "") : roleLabelForPresetId(rolePreset);
  return {
    representativeFirstName: p.representativeFirstName,
    representativeLastName: p.representativeLastName,
    representativeTitlePreset: titlePreset,
    representativeTitle,
    representativeEmail: p.representativeEmail,
    representativeRolePreset: rolePreset,
    representativeRole,
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
        label:
          "Geen bedrijfsnaam of adres uit register voor dit scenario — domeinkoppeling volgt (demo)",
      };
    }
    if (step.id === "email") {
      return {
        ...step,
        label:
          "Bedrijfsnaam en volledig adres ingevuld via het registratiedomein van uw e-mail (serverside, mock)",
      };
    }
    return step;
  });
}

export type RegistrationEnrichmentInput = {
  vatNumber: string;
  representativeEmail: string;
  preset: VatPrototypePreset;
};

/**
 * Combines mock register data with country from validated VAT and optional company data
 * from a serverside domain → organization lookup (mock). Country is never taken from e-mail TLD.
 */
export function enrichRegistrationContext(
  input: RegistrationEnrichmentInput,
): RegistrationEnrichmentResult {
  const { vatNumber, representativeEmail, preset } = input;
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
    hints.country = vatCountry
      ? "Afgeleid uit het landprefix van uw btw- of ondernemingsnummer. U kunt het land hier desgewenst aanpassen."
      : "Ingevuld volgens de scenario‑instelling (geen herkomst uit prefix in deze demo).";
  }

  const domainHintForField =
    domainSource === "demo_default_mock"
      ? DEMO_DOMAIN_MOCK_FIELD_HELPER
      : domainHit
        ? domainFieldHelper(domainHit.matchedHost)
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
 * After each simulated lookup step completes (0 = prefix … 4 = e-mail), which company fields the
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

    if (id === "prefix") {
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
    }

    if (id === "email") {
      companyFormFieldsPrefilledByMockLookup(input).forEach((k) => resolved.add(k));
    }
  }

  return resolved;
}

export const VAT_PROTOTYPE_PRESETS: readonly VatPrototypePreset[] = [
  {
    id: "be-kbo",
    label: "België — volledige registergegevens",
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
    label: "Nederland — volledige registergegevens",
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
    label: "Duitsland — alleen gedeeltelijk uit registers",
    vatNumber: "DE123456789",
    outcomeLabel: "Deels automatisch",
    outcomeMessage:
      "Het land staat vast op basis van uw nummer. Het register leverde in dit scenario geen bedrijfsnaam noch volledig adres. In deze demo vullen we die — straat, huisnummer, postcode en plaats — wanneer het registratiedomein van uw e-mailadres in de mock-database staat, serverside aan (niet afgeleid uit het TLD alleen). Geen koppeling: u vult alles zelf in.",
    demoSupplementsOrgAddressFromEmailDomain: true,
    demoPerson: {
      representativeFirstName: "Anna",
      representativeLastName: "Müller",
      representativeTitlePreset: "dr",
      representativeTitle: "",
      representativeEmail: "anna.mueller@packline-industry.de",
      representativeRolePreset: "legal_representative",
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
    label: "Frankrijk — bedrijfsgegevens handmatig",
    vatNumber: "FR40303265045",
    outcomeLabel: "Aanvullen vereist",
    outcomeMessage:
      "Het land staat vast op basis van uw nummer. Voor dit Franse scenario levert het register in de demo geen bedrijfsnaam noch vestigingsadres. Bedrijfsnaam en volledig adres worden hier — indien uw e-maildomein gekoppeld is in de mock — aangevuld via het registratiedomein van uw e-mail (serverside). Anders vult u de velden handmatig in.",
    demoSupplementsOrgAddressFromEmailDomain: true,
    demoPerson: {
      representativeFirstName: "Camille",
      representativeLastName: "Bernard",
      representativeTitlePreset: "mrs",
      representativeTitle: "",
      representativeEmail: "camille.bernard@packline-industry.fr",
      representativeRolePreset: "sales",
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
    label: "Verenigde Staten — buiten EU-registers",
    vatNumber: "US-EIN 12-3456789",
    outcomeLabel: "Aanvullen vereist",
    outcomeMessage:
      "U gaf een niet-Europees identificatienummer op; het land is afgeleid uit het nummer. Registergegevens voor bedrijfsnaam en vestigingsadres hebben we niet automatisch kunnen ophalen. We probeerden informatie te vinden van uw bedrijfsgegevens op basis van uw e-mailadres. Gelieve na te kijken en te corrigeren indien nodig.",
    demoSupplementsOrgAddressFromEmailDomain: true,
    demoPerson: {
      representativeFirstName: "Jordan",
      representativeLastName: "Taylor",
      representativeTitlePreset: "none",
      representativeTitle: "",
      representativeEmail: "jordan.taylor@packline-industry.com",
      representativeRolePreset: "procurement",
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
