/**
 * Mock postale-adres-lookup voor adresvelden die in één tekstveld worden
 * bijgehouden (bv. `clientAddress`, `projectAddress` op het Innovatie-attest).
 * Vervangt later door een echte postale API (Google Places, AddressFinder,
 * basisregistratie adressen NL, bpost lookup, INSEE, …) zonder dat de
 * consumer-side signatuur wijzigt.
 *
 * Het resultaat-item bevat zowel een uitgeschreven `formatted` adres (wat
 * we in het tekstveld zetten) als de losse componenten, zodat we later
 * desgewenst kunnen omschakelen naar gestructureerde opslag zonder de UI
 * te breken.
 */

export type AddressAutocompleteEntry = {
  /** Uitgeschreven adres in één regel — wat in het inputveld komt te staan. */
  formatted: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  countryCode: string;
};

const ADDRESS_MOCK_DATASET: readonly AddressAutocompleteEntry[] = [
  {
    street: "Nationalestraat",
    houseNumber: "5",
    postalCode: "2000",
    city: "Antwerpen",
    country: "België",
    countryCode: "BE",
    formatted: "Nationalestraat 5, 2000 Antwerpen, België",
  },
  {
    street: "Industrielaan",
    houseNumber: "12",
    postalCode: "9000",
    city: "Gent",
    country: "België",
    countryCode: "BE",
    formatted: "Industrielaan 12, 9000 Gent, België",
  },
  {
    street: "Antwerpsesteenweg",
    houseNumber: "145",
    postalCode: "2800",
    city: "Mechelen",
    country: "België",
    countryCode: "BE",
    formatted: "Antwerpsesteenweg 145, 2800 Mechelen, België",
  },
  {
    street: "Bouwlaan",
    houseNumber: "5",
    postalCode: "3500",
    city: "Hasselt",
    country: "België",
    countryCode: "BE",
    formatted: "Bouwlaan 5, 3500 Hasselt, België",
  },
  {
    street: "Researchpark",
    houseNumber: "14",
    postalCode: "3001",
    city: "Leuven",
    country: "België",
    countryCode: "BE",
    formatted: "Researchpark 14, 3001 Leuven, België",
  },
  {
    street: "Havendok",
    houseNumber: "8",
    postalCode: "2030",
    city: "Antwerpen",
    country: "België",
    countryCode: "BE",
    formatted: "Havendok 8, 2030 Antwerpen, België",
  },
  {
    street: "Avenue des Arts",
    houseNumber: "24",
    postalCode: "1000",
    city: "Bruxelles",
    country: "België",
    countryCode: "BE",
    formatted: "Avenue des Arts 24, 1000 Bruxelles, België",
  },
  {
    street: "Rue de la Forge",
    houseNumber: "47",
    postalCode: "4000",
    city: "Liège",
    country: "België",
    countryCode: "BE",
    formatted: "Rue de la Forge 47, 4000 Liège, België",
  },
  {
    street: "Keizersgracht",
    houseNumber: "100",
    postalCode: "1015 CW",
    city: "Amsterdam",
    country: "Nederland",
    countryCode: "NL",
    formatted: "Keizersgracht 100, 1015 CW Amsterdam, Nederland",
  },
  {
    street: "Cartesiusweg",
    houseNumber: "76",
    postalCode: "3534 BB",
    city: "Utrecht",
    country: "Nederland",
    countryCode: "NL",
    formatted: "Cartesiusweg 76, 3534 BB Utrecht, Nederland",
  },
  {
    street: "Strijp-S Laan",
    houseNumber: "12",
    postalCode: "5617 BB",
    city: "Eindhoven",
    country: "Nederland",
    countryCode: "NL",
    formatted: "Strijp-S Laan 12, 5617 BB Eindhoven, Nederland",
  },
  {
    street: "Maasboulevard",
    houseNumber: "45",
    postalCode: "3071 NK",
    city: "Rotterdam",
    country: "Nederland",
    countryCode: "NL",
    formatted: "Maasboulevard 45, 3071 NK Rotterdam, Nederland",
  },
];

/**
 * Async lookup tegen de mock-dataset. Filter is een naïeve case-insensitive
 * substring-match op straat, gemeente, postcode of het volledige adres.
 */
export function addressAutocomplete(
  query: string,
  signal: AbortSignal,
): Promise<AddressAutocompleteEntry[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const q = query.trim().toLowerCase();
      const matches = ADDRESS_MOCK_DATASET.filter(
        (entry) =>
          entry.formatted.toLowerCase().includes(q) ||
          entry.street.toLowerCase().includes(q) ||
          entry.city.toLowerCase().includes(q) ||
          entry.postalCode.toLowerCase().includes(q),
      );
      resolve([...matches]);
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
