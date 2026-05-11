import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge, Button } from "@procertus-ui/ui";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  BUNDLE_CERT_ORDER,
  BundleProductCard,
  type BundleCertKey,
  type BundleProduct,
} from "./BundleProductCard";

export {
  BUNDLE_CERT_META,
  BUNDLE_CERT_ORDER,
  BundleProductCard,
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
    for (const [id, set] of selections) {
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

/**
 * Verticaal gestapelde productkaarten. Elke kaart toont z'n categoriepad, productlabel
 * en een grid van {@link ChoiceCard} multi-toggles voor de aanvullende certificaties.
 */
export function BundleAssembleBody() {
  const { products, selections, toggleCert } = useBundleAssemble();
  return (
    <section
      aria-label="Geselecteerde producten"
      className="flex flex-col gap-component"
    >
      {products.map((product) => (
        <BundleProductCard
          key={product.id}
          product={product}
          selected={selections.get(product.id) ?? new Set<BundleCertKey>()}
          onToggle={(cert, checked) => toggleCert(product.id, cert, checked)}
        />
      ))}
    </section>
  );
}

/**
 * Sticky action bar voor de bundle-assemble stap. Render binnen
 * {@link TrajectLayout}'s `actionBar` slot. Toont "Terug" links en
 * "Annuleren / Verder" rechts, met daartussen de pakket-status badge die
 * benadrukt dat alles samen één pakket vormt.
 */
export function BundleAssembleActionBar() {
  const { productCount, onBack, onCancel, emitContinue } = useBundleAssemble();
  const productWordCap = productCount === 1 ? "Product" : "Producten";
  return (
    <>
      <Button type="button" variant="ghost" onClick={onBack} disabled={onBack == null}>
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        Terug
      </Button>
      <div className="flex flex-wrap items-center justify-end gap-component">
        <Badge
          variant="outline"
          aria-label={`Pakket-status: ${productCount} ${productWordCap.toLowerCase()}, samengesteld pakket`}
          className="hidden whitespace-nowrap sm:inline-flex"
        >
          {productCount} {productWordCap} · Samengesteld Pakket
        </Badge>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={onCancel == null}>
          Annuleren
        </Button>
        <Button type="button" onClick={emitContinue}>
          Verder
        </Button>
      </div>
    </>
  );
}

