/**
 * Mock gemeentelijst-lookup per land voor de Autocomplete op het plaats-veld
 * in adres-subforms (maatschappelijke zetel, facturatieadres, bouwheeradres,
 * projectadres). Vervangt later door een echte postale-gemeente-API zonder
 * dat de consumer-side signatuur wijzigt.
 *
 * Scope: alleen mock-data voor BE/NL/DE/FR. Voor onbekende landen (of een
 * leeg landcode-veld) heeft de consumer geen autocomplete-belofte; in dat
 * geval valt het plaats-veld terug op een plain `Input`.
 */

export type CityAutocompleteEntry = {
  /** Gemeente- of stadnaam zoals te tonen en op te slaan in `locality`. */
  name: string;
};

const CITIES_BY_COUNTRY_CODE: Record<string, readonly string[]> = {
  BE: [
    "Aalst",
    "Antwerpen",
    "Brugge",
    "Brussel",
    "Charleroi",
    "Genk",
    "Gent",
    "Hasselt",
    "Herentals",
    "Kortrijk",
    "Leuven",
    "Liège",
    "Mechelen",
    "Mons",
    "Namur",
    "Oostende",
    "Sint-Niklaas",
    "Turnhout",
  ],
  NL: [
    "Almere",
    "Amersfoort",
    "Amsterdam",
    "Apeldoorn",
    "Arnhem",
    "Breda",
    "Delft",
    "Den Haag",
    "Eindhoven",
    "Enschede",
    "Groningen",
    "Haarlem",
    "Leiden",
    "Maastricht",
    "Nijmegen",
    "Rotterdam",
    "Tilburg",
    "Utrecht",
    "Zwolle",
  ],
  DE: [
    "Berlin",
    "Bonn",
    "Bremen",
    "Dortmund",
    "Dresden",
    "Düsseldorf",
    "Essen",
    "Frankfurt am Main",
    "Hamburg",
    "Hannover",
    "Köln",
    "Leipzig",
    "München",
    "Münster",
    "Nürnberg",
    "Stuttgart",
  ],
  FR: [
    "Bordeaux",
    "Grenoble",
    "Lille",
    "Lyon",
    "Marseille",
    "Montpellier",
    "Nancy",
    "Nantes",
    "Nice",
    "Paris",
    "Reims",
    "Rennes",
    "Strasbourg",
    "Toulouse",
    "Tours",
  ],
};

/** True wanneer er een mock-dataset met steden bestaat voor deze ISO-landcode. */
export function hasCityAutocompleteForCountryCode(countryCode: string): boolean {
  return countryCode.trim().toUpperCase() in CITIES_BY_COUNTRY_CODE;
}

/**
 * Async lookup tegen de mock-dataset, gefilterd op landcode. Vervang dit
 * later door een echte postale-gemeente-API (bv. bpost, basisregistratie
 * adressen NL, INSEE, Destatis) zonder de consumer aan te raken.
 */
export function cityAutocomplete(
  query: string,
  signal: AbortSignal,
  countryCode: string,
): Promise<CityAutocompleteEntry[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const dataset = CITIES_BY_COUNTRY_CODE[countryCode.trim().toUpperCase()] ?? [];
      const q = query.trim().toLowerCase();
      const matches = dataset
        .filter((name) => name.toLowerCase().includes(q))
        .map((name) => ({ name }));
      resolve(matches);
    }, 200);

    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}
