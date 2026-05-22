"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Autocomplete } from "@/components/ui/autocomplete";
import { FieldDescription } from "@/components/ui/field";
import { highlightMatch } from "@/lib/highlight-match";

/**
 * Async type-as-you-search field. The trigger IS the input — there is no
 * separate search field inside the popover. The popover only appears when
 * the user has typed at least `minQueryLength` characters AND the lookup
 * returned results. Below-min-query, loading, and empty / error states are
 * all surfaced inside the input itself (spinner replaces the search icon,
 * the popover simply doesn't open). This keeps the field quiet when there's
 * nothing meaningful to show.
 *
 * Use for KBO/BTW-lookup, gemeentelijsten, postale adres-lookup, contact-pickers.
 * For static lists, use `Combobox` (search inside popover, opens on click).
 */
const meta: Meta<typeof Autocomplete> = {
  title: "components/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

type KboCompany = {
  vatNumber: string;
  name: string;
  street: string;
  postalCode: string;
  locality: string;
};

const KBO_MOCK: KboCompany[] = [
  {
    vatNumber: "BE0123.456.789",
    name: "Procertus NV",
    street: "Industrielaan 12",
    postalCode: "9000",
    locality: "Gent",
  },
  {
    vatNumber: "BE0234.567.890",
    name: "PackLine Industry SARL",
    street: "Avenue des Arts 24",
    postalCode: "1000",
    locality: "Bruxelles",
  },
  {
    vatNumber: "BE0345.678.901",
    name: "Bouwbedrijf De Vos & Zonen",
    street: "Antwerpsesteenweg 145",
    postalCode: "2800",
    locality: "Mechelen",
  },
  {
    vatNumber: "BE0456.789.012",
    name: "Metaalwerken Janssens BVBA",
    street: "Nijverheidsstraat 78",
    postalCode: "2200",
    locality: "Herentals",
  },
  {
    vatNumber: "BE0567.890.123",
    name: "Beton Technics NV",
    street: "Bouwlaan 5",
    postalCode: "3500",
    locality: "Hasselt",
  },
  {
    vatNumber: "BE0678.901.234",
    name: "Eco Materials Belgium",
    street: "Groene Weg 22",
    postalCode: "8000",
    locality: "Brugge",
  },
  {
    vatNumber: "BE0789.012.345",
    name: "Vlaams Verpakkingscentrum",
    street: "Havendok 8",
    postalCode: "2030",
    locality: "Antwerpen",
  },
  {
    vatNumber: "BE0890.123.456",
    name: "Innovatieve Bouwproducten BV",
    street: "Researchpark 14",
    postalCode: "3001",
    locality: "Leuven",
  },
];

function mockKboFetch(query: string, signal: AbortSignal): Promise<KboCompany[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const q = query.toLowerCase();
      const matches = KBO_MOCK.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.vatNumber.toLowerCase().includes(q) ||
          c.locality.toLowerCase().includes(q),
      );
      resolve(matches);
    }, 350);

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

function failingFetch(_query: string, signal: AbortSignal): Promise<KboCompany[]> {
  return new Promise((_resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      reject(new Error("Mock backend offline"));
    }, 350);

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

function KboItemRow({ company, query }: { company: KboCompany; query: string }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="truncate font-medium text-foreground">
        {highlightMatch(company.name, query)}
      </span>
      <span className="truncate text-xs text-muted-foreground">
        {highlightMatch(company.vatNumber, query)} &middot; {highlightMatch(company.locality, query)}
      </span>
    </span>
  );
}

/**
 * Default flow. Try "pro", "leuven" or "0123" to trigger the lookup.
 * Notice: the popover never appears until results exist. Below 2 chars, while
 * loading, or when the lookup returns zero items, the field stays quiet — the
 * spinner (mid-fetch) and the search icon (idle) inside the input are the
 * only feedback. Selecting an entry fills the input and the X-icon clears it.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<KboCompany | null>(null);
    return (
      <div className="w-[340px]">
        <Autocomplete<KboCompany>
          value={value}
          onChange={setValue}
          fetchSuggestions={mockKboFetch}
          itemKey={(c) => c.vatNumber}
          itemLabel={(c) => `${c.name} (${c.vatNumber})`}
          renderItem={(c, q) => <KboItemRow company={c} query={q} />}
          resultsHeading={() => "Zoekresultaten"}
          emptyMessage={(q) => (
            <>
              Geen btw-nummer gevonden voor &quot;
              <span className="font-medium text-foreground">{q}</span>&quot;.
            </>
          )}
          placeholder="Zoek bedrijf op naam, BTW of stad"
          clearAriaLabel="Wis bedrijfskeuze"
        />
        {value ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Geselecteerd adres: {value.street}, {value.postalCode} {value.locality}
          </p>
        ) : null}
      </div>
    );
  },
};

/**
 * Pre-selected value. The input shows the selected label as read-only with the
 * X-clear affordance. Tab into the field and press Escape to clear via keyboard.
 */
export const WithValue: Story = {
  render: () => {
    const [value, setValue] = React.useState<KboCompany | null>(KBO_MOCK[0] ?? null);
    return (
      <div className="w-[340px]">
        <Autocomplete<KboCompany>
          value={value}
          onChange={setValue}
          fetchSuggestions={mockKboFetch}
          itemKey={(c) => c.vatNumber}
          itemLabel={(c) => `${c.name} (${c.vatNumber})`}
          renderItem={(c, q) => <KboItemRow company={c} query={q} />}
          placeholder="Zoek bedrijf op naam, BTW of stad"
        />
      </div>
    );
  },
};

/**
 * Progressive states (valid / invalid) mirror `Input` so the field signals
 * post-validation status consistently across the form.
 */
export const States: Story = {
  render: () => {
    const [valid, setValid] = React.useState<KboCompany | null>(KBO_MOCK[0] ?? null);
    const [invalid, setInvalid] = React.useState<KboCompany | null>(null);
    return (
      <div className="flex w-[340px] flex-col gap-component">
        <Autocomplete<KboCompany>
          value={valid}
          onChange={setValid}
          fetchSuggestions={mockKboFetch}
          itemKey={(c) => c.vatNumber}
          itemLabel={(c) => `${c.name} (${c.vatNumber})`}
          renderItem={(c, q) => <KboItemRow company={c} query={q} />}
          state="valid"
          placeholder="Valid state"
        />
        <Autocomplete<KboCompany>
          value={invalid}
          onChange={setInvalid}
          fetchSuggestions={mockKboFetch}
          itemKey={(c) => c.vatNumber}
          itemLabel={(c) => `${c.name} (${c.vatNumber})`}
          renderItem={(c, q) => <KboItemRow company={c} query={q} />}
          state="invalid"
          placeholder="Invalid state"
        />
      </div>
    );
  },
};

/**
 * Disabled. Input is inert, no search runs.
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-[340px]">
      <Autocomplete<KboCompany>
        value={KBO_MOCK[0] ?? null}
        onChange={() => {}}
        fetchSuggestions={mockKboFetch}
        itemKey={(c) => c.vatNumber}
        itemLabel={(c) => `${c.name} (${c.vatNumber})`}
        renderItem={(c, q) => <KboItemRow company={c} query={q} />}
        disabled
        placeholder="Bedrijf zoeken"
      />
    </div>
  ),
};

/**
 * Error handling. The primitive never renders error UI inside the popover
 * (popover is reserved for results). Failures are forwarded via `onError`
 * so the caller can render their own message in a FieldDescription or toast.
 */
export const ErrorHandling: Story = {
  render: () => {
    const [value, setValue] = React.useState<KboCompany | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    return (
      <div className="w-[340px]">
        <Autocomplete<KboCompany>
          value={value}
          onChange={(v) => {
            setValue(v);
            setError(null);
          }}
          fetchSuggestions={failingFetch}
          itemKey={(c) => c.vatNumber}
          itemLabel={(c) => c.name}
          renderItem={(c, q) => <KboItemRow company={c} query={q} />}
          onError={() => setError("KBO-register tijdelijk niet bereikbaar. Probeer later opnieuw.")}
          placeholder="Bedrijf zoeken (mock-backend offline)"
          state={error ? "invalid" : undefined}
        />
        {error ? (
          <FieldDescription className="mt-1 text-destructive-foreground">{error}</FieldDescription>
        ) : null}
      </div>
    );
  },
};
