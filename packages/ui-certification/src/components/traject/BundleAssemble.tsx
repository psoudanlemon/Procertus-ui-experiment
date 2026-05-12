import { Button } from "@procertus-ui/ui";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { TrajectStoryFooter } from "./TrajectStoryFooter";

import {
  BUNDLE_CERT_META,
  BUNDLE_CERT_ORDER,
  BundleMatrixHeader,
  BundleMatrixProvider,
  BundleProductCard,
  BundleProductMobileCard,
  bundleAssembleMatrixGridTemplate,
  bundleMatrixExtraColumnKeys,
  type BundleCertKey,
  type BundleProduct,
} from "./BundleProductCard";

export {
  BUNDLE_CERT_META,
  BUNDLE_CERT_ORDER,
  BundleMatrixHeader,
  BundleMatrixProvider,
  BundleProductCard,
  BundleProductMobileCard,
  bundleAssembleMatrixGridTemplate,
  bundleMatrixExtraColumnKeys,
  bundleMatrixGridCols,
} from "./BundleProductCard";
export type {
  BundleCertKey,
  BundleCertMeta,
  BundleProduct,
  BundleProductCardProps,
} from "./BundleProductCard";

type ContextValue = {
  products: readonly BundleProduct[];
  primaryCert: BundleCertKey;
  matrixExtraCerts: readonly BundleCertKey[];
  selections: ReadonlyMap<string, ReadonlySet<BundleCertKey>>;
  productCount: number;
  toggleCert: (productId: string, cert: BundleCertKey, checked: boolean) => void;
  onCancel?: () => void;
  onBack?: () => void;
  onAddMore?: () => void;
  addMoreLabel?: string;
  backLabel?: string;
  emitContinue: () => void;
};

const BundleAssembleContext = createContext<ContextValue | null>(null);

function useBundleAssemble(): ContextValue {
  const ctx = useContext(BundleAssembleContext);
  if (!ctx) {
    throw new Error(
      "BundleAssembleBody / BundleAssembleActionBar must be used within BundleAssembleProvider",
    );
  }
  return ctx;
}

export type BundleAssembleProviderProps = {
  /** Geselecteerde producten uit de vorige stap; één kaart per product. */
  products: readonly BundleProduct[];
  /** Hoofdcertificatie zoals gekozen in de wegwijzer; pakket-breed van toepassing. */
  primaryCert: BundleCertKey;
  /** Optionele initiële extra-cert selectie per product. */
  initialSelections?: Record<string, readonly BundleCertKey[]>;
  onCancel?: () => void;
  onBack?: () => void;
  /**
   * Spring naar de wegwijzer zodat de gebruiker een **bijkomend certificaattype** kan
   * kiezen; bestaande traject-drafts blijven via merge in localStorage staan.
   */
  onAddMore?: () => void;
  addMoreLabel?: string;
  /** Label voor `onBack` (productselectie binnen dezelfde route). Default: `Terug`. */
  backLabel?: string;
  onContinue: (selections: Record<string, readonly BundleCertKey[]>) => void;
  children: ReactNode;
};

/**
 * Per-product compositie van een aanvraagpakket. Provider houdt de selectie van
 * extra certificaties bij zodat {@link TrajectLayout}'s `actionBar` en de body
 * dezelfde state zien zonder prop drilling. Mirrors the
 * {@link ProductSelectionBasketProvider} contract zodat de "Stel je aanvraagpakket
 * samen" pagina dezelfde shell-architectuur volgt als "Selecteer de producten".
 */
export function BundleAssembleProvider({
  products,
  primaryCert,
  initialSelections,
  onCancel,
  onBack,
  onAddMore,
  addMoreLabel,
  backLabel,
  onContinue,
  children,
}: BundleAssembleProviderProps) {
  const matrixExtraCerts = useMemo(
    () => bundleMatrixExtraColumnKeys(primaryCert, products),
    [primaryCert, products],
  );

  const [selections, setSelections] = useState<Map<string, Set<BundleCertKey>>>(() => {
    const initial = initialSelections ?? {};
    return new Map(
      products.map((p) => {
        const raw = initial[p.id] ?? [];
        const cleaned = raw.filter(
          (c) =>
            c !== p.rowPrimaryCert &&
            c !== primaryCert &&
            p.availableBundleCerts.includes(c),
        );
        return [p.id, new Set<BundleCertKey>(cleaned)] as const;
      }),
    );
  });

  const toggleCert = (productId: string, cert: BundleCertKey, checked: boolean) => {
    const row = products.find((p) => p.id === productId);
    if (!row) return;
    if (cert === row.rowPrimaryCert) return;
    if (!row.availableBundleCerts.includes(cert)) return;

    setSelections((prev) => {
      const current = new Set(prev.get(productId) ?? []);
      if (checked) current.add(cert);
      else current.delete(cert);
      const next = new Map(prev);
      next.set(productId, current);
      return next;
    });
  };

  const emitContinue = () => {
    const out: Record<string, readonly BundleCertKey[]> = {};
    for (const p of products) {
      const set = selections.get(p.id) ?? new Set<BundleCertKey>();
      out[p.id] = BUNDLE_CERT_ORDER.filter(
        (c) =>
          set.has(c) &&
          c !== p.rowPrimaryCert &&
          p.availableBundleCerts.includes(c),
      );
    }
    onContinue(out);
  };

  const value = useMemo<ContextValue>(
    () => ({
      products,
      primaryCert,
      matrixExtraCerts,
      selections,
      productCount: products.length,
      toggleCert,
      onCancel,
      onBack,
      onAddMore,
      addMoreLabel,
      backLabel,
      emitContinue,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      products,
      primaryCert,
      matrixExtraCerts,
      selections,
      onCancel,
      onBack,
      onAddMore,
      addMoreLabel,
      backLabel,
    ],
  );

  return (
    <BundleAssembleContext.Provider value={value}>{children}</BundleAssembleContext.Provider>
  );
}

export type BundleAssembleBodyProps = {
  /**
   * Toon één kolom-headerrij boven de eerste productkaart met korte cert-labels,
   * zodat de cards zelf compact kunnen blijven (alleen md+; mobiel toont de
   * cert-naam in elke ChoiceCard). Default `true`.
   */
  withColumnHeader?: boolean;
};

/**
 * Geselecteerde producten met responsive layout:
 *
 * - **md+:** matrix-view met vaste cert-kolommen, CSS-subgrid voor uitlijning over
 *   rijen heen, en {@link BundleMatrixProvider} voor gesynchroniseerde kolom-hover.
 * - **<md:** verticaal gestapelde {@link BundleProductMobileCard}s met een sticky
 *   product-header per kaart, full-width ChoiceCards, en bovenaan de
 *   hoofdcertificatie als read-only basis-marker.
 */
function formatDutchEnumeration(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} en ${items[1]}`;
  const head = items.slice(0, -1);
  const last = items[items.length - 1];
  return `${head.join(", ")} en ${last}`;
}

/**
 * Toelichting wanneer bepaalde bundel-certificaties geen kolom krijgen omdat geen enkel
 * geselecteerd product ze in de dataset heeft.
 */
function BundleAssembleOmittedCertTypesCallout({
  omitted,
}: {
  omitted: readonly BundleCertKey[];
}) {
  if (omitted.length === 0) return null;
  const labels = omitted.map((c) => BUNDLE_CERT_META[c].title);
  const listPhrase = formatDutchEnumeration(labels);
  return (
    <aside
      className="rounded-lg border border-border/70 bg-muted/40 px-component py-component text-sm leading-normal text-muted-foreground"
      aria-label="Toelichting bij niet-getoonde certificatietypes"
    >
      <p>
        <span className="font-medium text-foreground">
          Deze certificatietypes staan niet in de kolommen:{" "}
        </span>
        {listPhrase}. Ze zijn voor geen van uw geselecteerde producten beschikbaar in het
        aanbod en kunnen daarom niet aan dit pakket worden toegevoegd.
      </p>
    </aside>
  );
}

/**
 * Korte uitleg CE-beoordelingsniveaus wanneer CE ergens in het pakket actief is.
 * Sluit aan bij {@link BUNDLE_CERT_META.ce} en de cellen in procertus-categorization.
 */
function BundleAssembleCeLevelsGuideCallout() {
  return (
    <aside
      className="rounded-lg border border-border/70 bg-muted/40 px-component py-component text-sm leading-normal text-muted-foreground"
      aria-label="Uitleg bij CE-beoordelingsniveaus in deze matrix"
    >
      <p className="font-medium text-foreground">CE-niveaus in deze tabel</p>
      <p className="mt-micro">
        Onder de CE-checkbox staat het <strong>beoordelings- en verificatieniveau</strong> uit
        ons productoverzicht (conform Europese verordening 305/2011). Het cijfer zegt
        <strong> wie welke rol speelt</strong> bij typebeoordeling, productiecontrole en
        opvolging — niet “hoe goed” het product is.
      </p>
      <ul className="mt-micro list-disc space-y-micro pl-5">
        <li>
          <span className="font-medium text-foreground">1</span> en{" "}
          <span className="font-medium text-foreground">1+</span>: sterke betrokkenheid van een
          aangemelde instantie naast de fabrikant (1+ vergt doorgaans meer toezicht dan 1).
        </li>
        <li>
          <span className="font-medium text-foreground">2+</span>: de fabrikant voert een
          fabriekskwaliteitscontrole uit; een aangemelde instantie doet periodiek controles
          en audits.
        </li>
        <li>
          <span className="font-medium text-foreground">3</span>: nadruk op typebeproeving
          door een aangemelde instantie; de fabrikant volgt de prestaties in productie op.
        </li>
        <li>
          <span className="font-medium text-foreground">4</span>: route waarbij de fabrikant
          de voornaamste verantwoordelijkheid draagt; de aangemelde instantie is beperkter
          betrokken (vaak vooral typebeproeving waar het dossier dat vereist).
        </li>
      </ul>
      <p className="mt-micro text-xs leading-normal">
        Staat er <span className="font-medium text-foreground">Volgens productfiche</span>, dan
        is CE wel voorzien in het aanbod voor dat product, maar het overzicht hanteert geen
        vast cijferniveau in de cel.
      </p>
    </aside>
  );
}

function bundleAssembleAnyProductHasCeInPlay(
  products: readonly BundleProduct[],
  selections: ReadonlyMap<string, ReadonlySet<BundleCertKey>>,
): boolean {
  for (const p of products) {
    if (p.rowPrimaryCert === "ce") return true;
    const extra = selections.get(p.id);
    if (extra?.has("ce")) return true;
  }
  return false;
}

export function BundleAssembleBody({ withColumnHeader = true }: BundleAssembleBodyProps = {}) {
  const {
    products,
    primaryCert,
    matrixExtraCerts,
    selections,
    toggleCert,
    onAddMore,
    addMoreLabel,
  } = useBundleAssemble();
  const gridTemplate = bundleAssembleMatrixGridTemplate(matrixExtraCerts.length);

  const omittedExtraCertTypes = useMemo(
    () =>
      BUNDLE_CERT_ORDER.filter(
        (c) => c !== primaryCert && !matrixExtraCerts.includes(c),
      ),
    [primaryCert, matrixExtraCerts],
  );

  const showCeLevelsGuide = useMemo(
    () => bundleAssembleAnyProductHasCeInPlay(products, selections),
    [products, selections],
  );

  return (
    <>
      {onAddMore ? (
        <div className="flex flex-wrap items-center gap-component">
          <Button type="button" variant="outline" size="sm" onClick={onAddMore}>
            {addMoreLabel ?? "Nog certificatie toevoegen"}
          </Button>
        </div>
      ) : null}
      <ul
        aria-label="Geselecteerde producten"
        className="flex flex-col gap-section md:hidden"
      >
        {products.map((product) => (
          <li key={product.id}>
            <BundleProductMobileCard
              product={product}
              matrixExtraCerts={matrixExtraCerts}
              selected={selections.get(product.id) ?? new Set<BundleCertKey>()}
              onToggle={(cert, checked) => toggleCert(product.id, cert, checked)}
            />
          </li>
        ))}
      </ul>
      <BundleMatrixProvider primaryCert={primaryCert} matrixExtraCerts={matrixExtraCerts}>
        <section
          role="table"
          aria-label="Geselecteerde producten"
          className="hidden gap-component md:grid"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {withColumnHeader ? <BundleMatrixHeader /> : null}
          {products.map((product) => (
            <BundleProductCard
              key={product.id}
              product={product}
              selected={selections.get(product.id) ?? new Set<BundleCertKey>()}
              onToggle={(cert, checked) => toggleCert(product.id, cert, checked)}
            />
          ))}
        </section>
      </BundleMatrixProvider>
      {(omittedExtraCertTypes.length > 0 || showCeLevelsGuide) ? (
        <div className="mt-section flex flex-col gap-section">
          <BundleAssembleOmittedCertTypesCallout omitted={omittedExtraCertTypes} />
          {showCeLevelsGuide ? <BundleAssembleCeLevelsGuideCallout /> : null}
        </div>
      ) : null}
    </>
  );
}

/**
 * Sticky action bar: Annuleren, Terug naar productselectie, Bevestig selectie.
 * “Nog certificatie toevoegen” staat in de pagina-inhoud via {@link BundleAssembleBody},
 * niet in deze balk.
 */
export function BundleAssembleActionBar() {
  const { onBack, onCancel, backLabel, emitContinue } = useBundleAssemble();
  return (
    <TrajectStoryFooter
      onCancel={onCancel}
      onBack={onBack}
      onContinue={emitContinue}
      cancelLabel="Annuleren"
      backLabel={backLabel ?? "Terug"}
      continueLabel="Bevestig selectie"
    />
  );
}

