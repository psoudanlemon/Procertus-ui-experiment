import { REGISTRATION_COUNTRY_OPTIONS } from "./lib/vatPrototypePresets";

export type OnboardingRequestOrigin = "be" | "nl" | "eu" | "us" | "other";

export const ONBOARDING_REQUEST_ORIGIN_IDS: readonly OnboardingRequestOrigin[] = [
  "be",
  "nl",
  "eu",
  "us",
  "other",
] as const;

export type OnboardingRequestOriginOption = {
  id: OnboardingRequestOrigin;
  title: string;
  description: string;
};

/** User-facing choices: where the requesting company is based (drives later fields and flows). */
export const ONBOARDING_REQUEST_ORIGIN_OPTIONS: readonly OnboardingRequestOriginOption[] = [
  {
    id: "be",
    title: "België",
    description: "Uw organisatie is in België gevestigd.",
  },
  {
    id: "nl",
    title: "Nederland",
    description: "Uw organisatie is in Nederland gevestigd.",
  },
  {
    id: "eu",
    title: "Een ander Europees land",
    description: "Binnen de Europese Unie, maar niet in België of Nederland.",
  },
  {
    id: "us",
    title: "Verenigde Staten",
    description: "Uw organisatie is in de Verenigde Staten gevestigd.",
  },
  {
    id: "other",
    title: "Anders",
    description: "Buiten de Europese Unie en de Verenigde Staten.",
  },
];

/** Prominent tier cards in the origin step (Belgium & Netherlands only). */
const ONBOARDING_REQUEST_ORIGIN_HERO_IDS: readonly OnboardingRequestOrigin[] = ["be", "nl"];

export const ONBOARDING_REQUEST_ORIGIN_HERO_OPTIONS: readonly OnboardingRequestOriginOption[] =
  ONBOARDING_REQUEST_ORIGIN_HERO_IDS.map(
    (id) => ONBOARDING_REQUEST_ORIGIN_OPTIONS.find((o) => o.id === id)!,
  );

/** Compact default cards in the origin step (same row as hero options). */
export const ONBOARDING_REQUEST_ORIGIN_SECONDARY_OPTIONS: readonly OnboardingRequestOriginOption[] =
  ONBOARDING_REQUEST_ORIGIN_OPTIONS.filter(
    (o) => !ONBOARDING_REQUEST_ORIGIN_HERO_IDS.includes(o.id),
  );

/** Default VAT demo preset id per origin (first step of tailored capture). */
export function defaultPrototypePresetIdForRequestOrigin(origin: OnboardingRequestOrigin): string {
  switch (origin) {
    case "be":
      return "be-kbo";
    case "nl":
      return "nl-kvk";
    case "eu":
      return "de-partial";
    case "us":
      return "us-international";
    case "other":
      return "fr-manual";
  }
}

/** Which demo VAT scenarios are offered after the user chose an origin. */
export function vatPrototypePresetIdsForOrigin(origin: OnboardingRequestOrigin): readonly string[] {
  switch (origin) {
    case "be":
      return ["be-kbo"];
    case "nl":
      return ["nl-kvk"];
    case "eu":
      return ["de-partial", "fr-manual"];
    case "us":
      return ["us-international"];
    case "other":
      return ["fr-manual", "us-international", "de-partial"];
  }
}

const US_LABEL = "Verenigde Staten";

function sortedUniqueCountries(names: readonly string[]): string[] {
  return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "nl"));
}

/** Country dropdown entries for the main organisation address, scoped by request origin. */
export function registrationCountryOptionsForRequestOrigin(
  origin: OnboardingRequestOrigin,
  currentCountry: string,
): readonly string[] {
  const trimmed = currentCountry?.trim() ?? "";
  const euWithoutBenlus = REGISTRATION_COUNTRY_OPTIONS.filter(
    (c) => c !== US_LABEL && c !== "België" && c !== "Nederland",
  );
  let base: readonly string[];
  switch (origin) {
    case "be":
      base = ["België"];
      break;
    case "nl":
      base = ["Nederland"];
      break;
    case "eu":
      base = sortedUniqueCountries([...euWithoutBenlus, "België", "Nederland"]);
      break;
    case "us":
      base = [US_LABEL];
      break;
    case "other":
      base = REGISTRATION_COUNTRY_OPTIONS;
      break;
    default:
      base = REGISTRATION_COUNTRY_OPTIONS;
  }
  if (trimmed && !base.includes(trimmed)) {
    return sortedUniqueCountries([...base, trimmed]);
  }
  return base;
}

/** When true, organisatie‑land is fixed by de keuze in stap “Land of regio” (één land). */
export function isFirmaCountryLockedToRequestOrigin(origin: OnboardingRequestOrigin | ""): boolean {
  return origin === "be" || origin === "nl" || origin === "us";
}

/** Vast land voor BE/NL/US-flows; `null` voor EU/anders (gebruiker kiest land in het formulier). */
export function firmaCountryLabelLockedForOrigin(
  origin: OnboardingRequestOrigin | "",
): string | null {
  switch (origin) {
    case "be":
      return "België";
    case "nl":
      return "Nederland";
    case "us":
      return "Verenigde Staten";
    default:
      return null;
  }
}

/**
 * Label voor de registratie‑bronkaart (stap Bedrijf): vaste landnaam voor BE/NL/US, anders gekozen
 * `country` uit het adresformulier.
 */
export function companyRegistrationSourceCountryLabel(
  origin: OnboardingRequestOrigin | "",
  country: string,
): string {
  const fixed = firmaCountryLabelLockedForOrigin(origin);
  if (fixed) return fixed;
  return country.trim() || "—";
}
