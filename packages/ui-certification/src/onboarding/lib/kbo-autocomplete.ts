/**
 * Mock KBO/CBE (Belgisch ondernemingsregister) lookup voor de Autocomplete op
 * de Registratie-stap. Vervangt later door een echte register-fetch zonder dat
 * de consumer-side signatuur wijzigt.
 *
 * Scope: alleen Belgische bedrijven. Voor `OnboardingRequestOrigin === "nl"`
 * komt later een aparte `kvkAutocomplete`-adapter; voor andere origins blijft
 * de plain Input met structurele validatie het juiste pattern (registers zijn
 * niet publiek doorzoekbaar of niet gratis).
 */

export type KboCompany = {
  /** Genormaliseerd BTW-nummer in canonieke notatie (`BE0xxx.xxx.xxx`). */
  vatNumber: string;
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
 * Mock-dataset. Eerste entry komt overeen met `VAT_PROTOTYPE_PRESETS.be-kbo`
 * zodat de "Voorbeeldmodus"-Select en de Autocomplete dezelfde data tonen
 * voor dat ene scenario. De overige entries zijn fictief en alleen bedoeld
 * om de Autocomplete-zoekruimte uit te breiden voor demo-doeleinden.
 */
const KBO_MOCK_COMPANIES: KboCompany[] = [
  {
    vatNumber: "BE0403.107.223",
    name: "Demo Foods BV",
    street: "Nationalestraat",
    houseNumber: "5",
    postalCode: "2000",
    city: "Antwerpen",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0501.234.567",
    name: "Procertus NV",
    street: "Industrielaan",
    houseNumber: "12",
    postalCode: "9000",
    city: "Gent",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0612.345.678",
    name: "Bouwbedrijf De Vos & Zonen",
    street: "Antwerpsesteenweg",
    houseNumber: "145",
    postalCode: "2800",
    city: "Mechelen",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0723.456.789",
    name: "Metaalwerken Janssens BVBA",
    street: "Nijverheidsstraat",
    houseNumber: "78",
    postalCode: "2200",
    city: "Herentals",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0834.567.890",
    name: "Beton Technics NV",
    street: "Bouwlaan",
    houseNumber: "5",
    postalCode: "3500",
    city: "Hasselt",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0945.678.901",
    name: "Eco Materials Belgium",
    street: "Groene Weg",
    houseNumber: "22",
    postalCode: "8000",
    city: "Brugge",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0156.789.012",
    name: "Vlaams Verpakkingscentrum",
    street: "Havendok",
    houseNumber: "8",
    postalCode: "2030",
    city: "Antwerpen",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0267.890.123",
    name: "Innovatieve Bouwproducten BV",
    street: "Researchpark",
    houseNumber: "14",
    postalCode: "3001",
    city: "Leuven",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0378.901.234",
    name: "PackLine Industry SARL",
    street: "Avenue des Arts",
    houseNumber: "24",
    postalCode: "1000",
    city: "Bruxelles",
    country: "België",
    countryCode: "BE",
  },
  {
    vatNumber: "BE0489.012.345",
    name: "Atelier Wallon Constructions",
    street: "Rue de la Forge",
    houseNumber: "47",
    postalCode: "4000",
    city: "Liège",
    country: "België",
    countryCode: "BE",
  },
];

/**
 * Synchronous lookup tegen de mock-dataset. Gebruikt door de Autocomplete om
 * `context.vatNumber` terug te mappen naar een `KboCompany` (zodat de
 * geselecteerde state behouden blijft over re-renders en remounts).
 */
export function findKboCompanyByVatNumber(vatNumber: string): KboCompany | null {
  const normalized = vatNumber.trim().toLowerCase();
  if (!normalized) return null;
  return (
    KBO_MOCK_COMPANIES.find((c) => c.vatNumber.toLowerCase() === normalized) ?? null
  );
}

/**
 * Async lookup tegen de mock-dataset. Vervang dit later door een echte
 * register-fetch (CBE openbare zoekfunctie) zonder de consumer aan te raken.
 *
 * Filter is een naïeve case-insensitive substring-match op naam, BTW-nummer
 * en stad. Real-world API doet dit server-side en levert vermoedelijk
 * ranking-data; in dat geval mappen we hier de respons naar `KboCompany[]`.
 */
export function kboAutocomplete(query: string, signal: AbortSignal): Promise<KboCompany[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const q = query.trim().toLowerCase();
      const matches = KBO_MOCK_COMPANIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.vatNumber.toLowerCase().includes(q) ||
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
