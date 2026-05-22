/**
 * Mock KvK (Nederlands handelsregister) lookup voor de Autocomplete op de
 * Registratie-stap. Mirror van [kbo-autocomplete.ts](./kbo-autocomplete.ts) —
 * vervangt later door een echte KvK-fetch zonder dat de consumer-side
 * signatuur wijzigt.
 *
 * Scope: alleen Nederlandse bedrijven. Voor andere origins zonder publiek
 * doorzoekbaar of pay-walled register blijft de plain Input met structurele
 * validatie het juiste pattern.
 */

export type KvkCompany = {
  /** Genormaliseerd btw-nummer in canonieke notatie (`NLxxxxxxxxxBxx`). */
  vatNumber: string;
  /** 8-cijferig KvK-nummer; toont mee in het resultaat-item. */
  kvkNumber: string;
  name: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  /** Vol uitgeschreven landnaam, zoals het `country`-veld in `CustomerContext`. */
  country: string;
  /** ISO 3166-1 alpha-2, gebruikt door `CustomerContext.addressCountryCode`. */
  countryCode: string;
};

/**
 * Mock-dataset. Eerste entry komt overeen met `VAT_PROTOTYPE_PRESETS.nl-kvk`
 * zodat de "Voorbeeldmodus"-Select en de Autocomplete dezelfde data tonen
 * voor dat ene scenario. De overige entries zijn fictief en alleen bedoeld
 * om de Autocomplete-zoekruimte uit te breiden voor demo-doeleinden.
 */
const KVK_MOCK_COMPANIES: KvkCompany[] = [
  {
    vatNumber: "NL001234567B01",
    kvkNumber: "34567890",
    name: "Demo Delta Packaging B.V.",
    street: "Keizersgracht",
    houseNumber: "100",
    postalCode: "1015 CW",
    city: "Amsterdam",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL812345678B02",
    kvkNumber: "27123456",
    name: "Rotterdamse Bouwmaterialen B.V.",
    street: "Maasboulevard",
    houseNumber: "45",
    postalCode: "3071 NK",
    city: "Rotterdam",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL823456789B01",
    kvkNumber: "30234567",
    name: "Eindhoven Innovation Works B.V.",
    street: "Strijp-S Laan",
    houseNumber: "12",
    postalCode: "5617 BB",
    city: "Eindhoven",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL834567890B01",
    kvkNumber: "20345678",
    name: "Haagse Constructiewerken B.V.",
    street: "Lange Voorhout",
    houseNumber: "28",
    postalCode: "2514 EE",
    city: "Den Haag",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL845678901B01",
    kvkNumber: "30456789",
    name: "Utrechtse Beton & Staal B.V.",
    street: "Cartesiusweg",
    houseNumber: "76",
    postalCode: "3534 BB",
    city: "Utrecht",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL856789012B01",
    kvkNumber: "60567890",
    name: "Eco Materialen Nederland B.V.",
    street: "Groene Hilledijk",
    houseNumber: "150",
    postalCode: "3073 EE",
    city: "Rotterdam",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL867890123B01",
    kvkNumber: "08678901",
    name: "Twentse Metaalindustrie B.V.",
    street: "Industrieweg",
    houseNumber: "34",
    postalCode: "7547 RV",
    city: "Enschede",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL878901234B01",
    kvkNumber: "01789012",
    name: "Groninger Verpakkingsbedrijf B.V.",
    street: "Sontweg",
    houseNumber: "5",
    postalCode: "9723 AT",
    city: "Groningen",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL889012345B01",
    kvkNumber: "17890123",
    name: "Brabantse Innovatieve Bouwstoffen B.V.",
    street: "Spoorlaan",
    houseNumber: "420",
    postalCode: "5038 CG",
    city: "Tilburg",
    country: "Nederland",
    countryCode: "NL",
  },
  {
    vatNumber: "NL890123456B01",
    kvkNumber: "37901234",
    name: "Noord-Hollands Atelier B.V.",
    street: "Singel",
    houseNumber: "212",
    postalCode: "1016 AB",
    city: "Amsterdam",
    country: "Nederland",
    countryCode: "NL",
  },
];

/**
 * Synchronous lookup tegen de mock-dataset. Gebruikt door de Autocomplete om
 * `context.vatNumber` terug te mappen naar een `KvkCompany` (zodat de
 * geselecteerde state behouden blijft over re-renders en remounts).
 */
export function findKvkCompanyByVatNumber(vatNumber: string): KvkCompany | null {
  const normalized = vatNumber.trim().toLowerCase();
  if (!normalized) return null;
  return (
    KVK_MOCK_COMPANIES.find((c) => c.vatNumber.toLowerCase() === normalized) ?? null
  );
}

/**
 * Async lookup tegen de mock-dataset. Vervang dit later door een echte
 * register-fetch (KvK Handelsregister API) zonder de consumer aan te raken.
 *
 * Filter is een naïeve case-insensitive substring-match op naam, btw-nummer,
 * KvK-nummer en stad. Real-world API doet dit server-side.
 */
export function kvkAutocomplete(query: string, signal: AbortSignal): Promise<KvkCompany[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const q = query.trim().toLowerCase();
      const matches = KVK_MOCK_COMPANIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.vatNumber.toLowerCase().includes(q) ||
          c.kvkNumber.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
      resolve(matches);
    }, 300);

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
