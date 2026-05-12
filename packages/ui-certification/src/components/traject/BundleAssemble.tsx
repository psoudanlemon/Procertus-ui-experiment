import { Button } from "@procertus-ui/ui";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  BUNDLE_CERT_ORDER,
  BundleMatrixHeader,
  BundleMatrixProvider,
  BundleProductCard,
  BundleProductMobileCard,
  bundleMatrixGridCols,
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
  selections: ReadonlyMap<string, ReadonlySet<BundleCertKey>>;
  productCount: number;
  toggleCert: (productId: string, cert: BundleCertKey, checked: boolean) => void;
  onCancel?: () => void;
  onBack?: () => void;
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
  onContinue,
  children,
}: BundleAssembleProviderProps) {
  const [selections, setSelections] = useState<Map<string, Set<BundleCertKey>>>(
    () =>
      new Map(
        products.map(
          (p) =>
            [
              p.id,
              new Set<BundleCertKey>(initialSelections?.[p.id] ?? []),
            ] as const,
        ),
      ),
  );

  const toggleCert = (productId: string, cert: BundleCertKey, checked: boolean) => {
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
    for (const [id, set] of Array.from(selections.entries())) {
      out[id] = BUNDLE_CERT_ORDER.filter((c) => set.has(c));
    }
    onContinue(out);
  };

  const value = useMemo<ContextValue>(
    () => ({
      products,
      primaryCert,
      selections,
      productCount: products.length,
      toggleCert,
      onCancel,
      onBack,
      emitContinue,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, primaryCert, selections, onCancel, onBack],
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
export function BundleAssembleBody({ withColumnHeader = true }: BundleAssembleBodyProps = {}) {
  const { products, primaryCert, selections, toggleCert } = useBundleAssemble();

  return (
    <>
      <ul
        aria-label="Geselecteerde producten"
        className="flex flex-col gap-section md:hidden"
      >
        {products.map((product) => (
          <li key={product.id}>
            <BundleProductMobileCard
              product={product}
              primaryCert={primaryCert}
              selected={selections.get(product.id) ?? new Set<BundleCertKey>()}
              onToggle={(cert, checked) => toggleCert(product.id, cert, checked)}
            />
          </li>
        ))}
      </ul>
      <BundleMatrixProvider primaryCert={primaryCert}>
        <section
          role="table"
          aria-label="Geselecteerde producten"
          className={`hidden gap-component md:grid ${bundleMatrixGridCols.excludingPrimary}`}
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
    </>
  );
}

/**
 * Sticky action bar voor de bundle-assemble stap. Render binnen
 * {@link TrajectLayout}'s `actionBar` slot. Latere-stap variant: "Annuleren"
 * (ghost, links) springt naar de wegwijzer, "Terug" (outline, rechts) gaat
 * een stap terug binnen de flow, en "Bevestig selectie" (primary, rechts)
 * sluit de pakket-samenstelling af. Op mobile stapelen de knoppen verticaal;
 * vanaf `md` zitten Terug + Bevestig selectie als groep rechts en Annuleren
 * links.
 */
export function BundleAssembleActionBar() {
  const { onBack, onCancel, emitContinue } = useBundleAssemble();
  return (
    <div className="grid w-full grid-cols-2 items-center gap-component md:flex">
      <Button
        type="button"
        size="lg"
        className="col-span-2 h-12 w-full px-6 md:order-3 md:col-auto md:h-9 md:w-auto md:px-4"
        onClick={emitContinue}
      >
        Bevestig selectie
      </Button>
      {onCancel ? (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="h-12 w-full px-6 md:order-1 md:h-9 md:w-auto md:px-4"
          onClick={onCancel}
        >
          Annuleren
        </Button>
      ) : null}
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={`h-12 w-full px-6 md:order-2 md:ml-auto md:h-9 md:w-auto md:px-4 ${onCancel == null ? "col-span-2 md:col-auto" : ""}`}
          onClick={onBack}
        >
          Terug
        </Button>
      ) : null}
    </div>
  );
}

