import {
  Checkbox,
  ChoiceCard,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@procertus-ui/ui";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { BUNDLE_CERT_ORDER, type BundleCertKey } from "../../bundle-product-certs";
import { bundleMatrixCeSublabel } from "../../helpers";
import { ProductCategoryTrail } from "./ProductCategoryTrail";

export { BUNDLE_CERT_ORDER, type BundleCertKey } from "../../bundle-product-certs";
export { bundleMatrixExtraColumnKeys } from "../../bundle-product-certs";

export type BundleCertMeta = {
  /** Volledige naam zoals getoond in de wegwijzer; gebruikt op kaart-niveau. */
  title: string;
  /** Korte abbreviation voor compacte matrix-kolom-headers. */
  shortTitle: string;
  description: string;
};

/**
 * Presentational copy per certification. Geëxporteerd zodat pages het pakket-brede
 * "Hoofdcertificatie" pillen en eventuele andere headers consistent kunnen labelen.
 * Producten kunnen aan deze certificatie- en document-trajecten gekoppeld worden (bundelpakket).
 */
export const BUNDLE_CERT_META: Record<BundleCertKey, BundleCertMeta> = {
  benor: {
    title: "BENOR-certificatie",
    shortTitle: "BENOR",
    description: "Productgebonden BENOR-certificatie volgens de PTV-voorschriften.",
  },
  ce: {
    title: "CE-markering",
    shortTitle: "CE",
    description: "Productgebonden conformiteitsmarkering volgens de Europese verordening 305/2011.",
  },
  ssd: {
    title: "SSD",
    shortTitle: "SSD",
    description: "Sortie du Statut de Déchets, Waalse certificatie voor uitstroom uit afvalstatuut.",
  },
  procertus: {
    title: "PROCERTUS-attest",
    shortTitle: "PROCERTUS",
    description: "Eigen attest van PROCERTUS, strikt gekoppeld aan een beperkt aantal producten.",
  },
  epd: {
    title: "Environmental Product Declaration",
    shortTitle: "EPD",
    description:
      "Milieuproductverklaring (EPD); via PROCERTUS voor elk producttype in de catalogus aan te vragen.",
  },
};

export type BundleProduct = {
  id: string;
  label: string;
  /** Volledig categoriepad als platte string, identiek aan de basketrij-prefix. */
  categoryTrail: string;
  /**
   * Certificaties die volgens het categorisatiebestand voor dit product aangeboden worden
   * ({@link getAvailableBundleProductCertKeys}).
   */
  availableBundleCerts: readonly BundleCertKey[];
  /**
   * Reeds gekozen certificatie in de productselectie-stap (wegwijzer / concept); niet opnieuw
   * kiesbaar in de extra-kolommen.
   */
  rowPrimaryCert: BundleCertKey;
  /**
   * Ruwe `certification.ce` cel uit het categorisatiebestand wanneer CE voor dit product
   * in de dataset voorkomt (bv. `2+`, `4`) — ook als CE de hoofdcertificatie is;
   * gebruikt voor een sublabel onder CE-matrixcellen.
   */
  ceAvailabilityRaw?: string;
};

export type BundleProductCardProps = {
  product: BundleProduct;
  selected: ReadonlySet<BundleCertKey>;
  onToggle: (cert: BundleCertKey, checked: boolean) => void;
};

type MatrixContextValue = {
  /** Pakket-brede hoofdcertificatie (wegwijzer); eigen kolom als read-only basis per rij. */
  primaryCert: BundleCertKey;
  /** Toggle-kolommen: certs ≠ primary waarvoor minstens één product in het pakket data-ondersteuning heeft. */
  matrixExtraCerts: readonly BundleCertKey[];
};

const BundleMatrixContext = createContext<MatrixContextValue | null>(null);

export type BundleMatrixProviderProps = {
  children: ReactNode;
  /** Pakket-brede hoofdcertificatie (wegwijzer-service). */
  primaryCert: BundleCertKey;
  /** Extra kolommen in vaste volgorde; zie {@link bundleMatrixExtraColumnKeys}. */
  matrixExtraCerts: readonly BundleCertKey[];
};

/**
 * Geeft het gedeelde matrix-raster en kolomset door aan {@link BundleProductCard} /
 * {@link BundleMatrixHeader}. De ouder zet {@link bundleAssembleMatrixGridTemplate} op de
 * `section`.
 */
export function BundleMatrixProvider({
  children,
  primaryCert,
  matrixExtraCerts,
}: BundleMatrixProviderProps) {
  const value = useMemo<MatrixContextValue>(
    () => ({ primaryCert, matrixExtraCerts }),
    [primaryCert, matrixExtraCerts],
  );
  return (
    <BundleMatrixContext.Provider value={value}>{children}</BundleMatrixContext.Provider>
  );
}

/** `grid-template-columns` voor desktop bundle-matrix. */
export function bundleAssembleMatrixGridTemplate(matrixExtraCertCount: number): string {
  if (matrixExtraCertCount <= 0) {
    return "minmax(0,1fr) 7rem";
  }
  return `minmax(0,1fr) 7rem repeat(${matrixExtraCertCount}, 7rem)`;
}

/**
 * @deprecated Gebruik {@link bundleAssembleMatrixGridTemplate}; enkel voor oudere stories.
 */
export const bundleMatrixGridCols = {
  all: "grid-cols-[1fr_repeat(4,7rem)]",
  excludingPrimary: "grid-cols-[1fr_repeat(3,7rem)]",
} as const;

/**
 * Productlabel + breadcrumb op één regel, met truncate-detectie. Wanneer de
 * regel visueel afgekapt wordt, verschijnt na ~1.5s hover een tooltip met de
 * volledige productnaam. ResizeObserver houdt het truncate-flag bij wanneer
 * de kolombreedte of viewport verandert. Het categoriepad wordt via de
 * gedeelde {@link ProductCategoryTrail} gerenderd zodat de visuele
 * behandeling 1-op-1 gelijk loopt met de catalogus- en basket-rijen.
 */
function ProductLabelLine({
  label,
  trail,
  className,
}: {
  label: string;
  trail: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      setIsTruncated(el.scrollWidth - el.clientWidth > 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [label, trail]);

  const line = (
    <p ref={ref} className={cn("truncate text-sm leading-snug", className)}>
      <span className="font-medium">{label}</span>
      <ProductCategoryTrail trail={trail} />
    </p>
  );

  return (
    <TooltipProvider delayDuration={600}>
      <Tooltip>
        <TooltipTrigger asChild>{line}</TooltipTrigger>
        {isTruncated ? (
          <TooltipContent side="top" align="start" className="max-w-md">
            <div className="flex flex-col gap-micro">
              <span className="font-medium">{label}</span>
              {trail ? (
                <span className="text-xs opacity-80">{trail}</span>
              ) : null}
            </div>
          </TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Kolom-headerrij voor de matrix: korte cert-labels boven elke ChoiceCard-kolom,
 * zodat de cards zelf compact kunnen blijven. Plaats binnen hetzelfde grid als
 * de {@link BundleProductCard}s.
 */
export function BundleMatrixHeader() {
  const matrix = useContext(BundleMatrixContext);
  if (!matrix) {
    throw new Error("BundleMatrixHeader must be used within BundleMatrixProvider");
  }
  const { primaryCert, matrixExtraCerts } = matrix;
  const primaryMeta = BUNDLE_CERT_META[primaryCert];
  return (
    <div
      role="row"
      className="col-span-full grid grid-cols-subgrid items-end gap-component px-component pb-micro"
    >
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Gekozen product
      </span>
      <span
        className="py-micro text-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
        title={primaryMeta.title}
      >
        {primaryMeta.shortTitle}
      </span>
      {matrixExtraCerts.map((cert) => (
        <span
          key={cert}
          className="py-micro text-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
          {BUNDLE_CERT_META[cert].shortTitle}
        </span>
      ))}
    </div>
  );
}

/**
 * Eén rij in de "Stel je aanvraagpakket samen"-matrix. Toont links het categoriepad
 * en productlabel en daarnaast, op vaste kolomposities, één compacte ChoiceCard per
 * certificatie uit {@link BUNDLE_CERT_ORDER}. Cellen voor niet-beschikbare certs
 * blijven leeg zodat de verticale uitlijning tussen rijen bewaard blijft.
 *
 * Wanneer een {@link BundleMatrixProvider} aanwezig is gebruikt de kaart `subgrid`
 * en deelt hij kolomtracks met de overige kaarten. Standalone (zonder provider)
 * definieert de kaart zijn eigen grid op basis van {@link bundleMatrixGridCols}.
 */
export type BundleProductMobileCardProps = BundleProductCardProps & {
  /** Zelfde kolomvolgorde als de desktop-matrix. */
  matrixExtraCerts: readonly BundleCertKey[];
};

/**
 * Mobiele variant van {@link BundleProductCard}: eerst de vast gekozen certificatie,
 * daarna één Control per extra kolom (alleen items die in de dataset voor dit product
 * bestaan).
 */
export function BundleProductMobileCard({
  product,
  selected,
  onToggle,
  matrixExtraCerts,
}: BundleProductMobileCardProps) {
  const rowPrimary = product.rowPrimaryCert;
  const primaryMeta = BUNDLE_CERT_META[rowPrimary];
  const ceSublabel = bundleMatrixCeSublabel(product.ceAvailabilityRaw);

  const extras = matrixExtraCerts
    .filter((cert) => cert !== rowPrimary)
    .filter((cert) => product.availableBundleCerts.includes(cert));

  return (
    <article
      aria-label={`Aanvraagpakket voor ${product.label}`}
      className="overflow-hidden rounded-lg border bg-card"
    >
      <header className="sticky top-0 z-10 bg-card/95 px-section py-component backdrop-blur-sm">
        <ProductLabelLine label={product.label} trail={product.categoryTrail} />
      </header>
      <div className="flex flex-col gap-component p-section pt-0">
        <ChoiceCard
          value={`${product.id}-primary`}
          controlId={`${product.id}-row-primary-mobile`}
          title={primaryMeta.title}
          description={
            rowPrimary === "ce" && ceSublabel
              ? `Reeds gekozen voor dit product — niet wijzigbaar. ${ceSublabel}`
              : "Reeds gekozen voor dit product — niet wijzigbaar"
          }
          controlPosition="leading"
          selectionMode="multiple"
          checked
          disabled
          className="w-full"
        />
        {extras.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Geen extra certificaten beschikbaar voor dit product.
          </p>
        ) : (
          extras.map((cert) => {
            const meta = BUNDLE_CERT_META[cert];
            const isChecked = selected.has(cert);
            return (
              <ChoiceCard
                key={cert}
                value={cert}
                controlId={`${product.id}-${cert}-mobile`}
                title={meta.title}
                description={cert === "ce" ? ceSublabel : undefined}
                controlPosition="leading"
                selectionMode="multiple"
                checked={isChecked}
                onCheckedChange={(next) => onToggle(cert, next)}
                className="w-full"
              />
            );
          })
        )}
      </div>
    </article>
  );
}

type MatrixCertCheckboxMode = "primary-readonly" | "extra-locked" | "unavailable" | "editable";

/**
 * Read-only maar aangevinkt: zelfde primary filled box + tick als bij interactieve checkboxes
 * (default `disabled:opacity-50` zou de tick anders doen verbleken). Radix-checkbox gebruikt
 * `data-checked` op de root (zie `@procertus-ui/ui`).
 */
const MATRIX_CERT_CHECKBOX_READONLY_CHECKED_CLASS =
  "disabled:data-checked:border-primary disabled:data-checked:bg-primary disabled:data-checked:text-primary-foreground disabled:data-checked:opacity-100 dark:disabled:data-checked:bg-primary";

/**
 * Één cert-cel in de desktop-matrix: overal dezelfde checkbox + hover-rand als de
 * bevestigde kolommen (geen afwijkende “kaal” checkboxen of extra sublabels).
 */
function MatrixCertCheckboxCell({
  productId,
  productLabel,
  cert,
  mode,
  checked,
  onCheckedChange,
  ceSublabel,
}: {
  productId: string;
  productLabel: string;
  cert: BundleCertKey;
  mode: MatrixCertCheckboxMode;
  checked: boolean;
  onCheckedChange?: (next: boolean) => void;
  /** Alleen voor `cert === "ce"`: CE-niveau uit de dataset. */
  ceSublabel?: string;
}) {
  const meta = BUNDLE_CERT_META[cert];
  const suffix =
    mode === "primary-readonly"
      ? "matrix-primary"
      : mode === "extra-locked"
        ? `matrix-${cert}-locked`
        : mode === "unavailable"
          ? `matrix-${cert}-na`
          : `matrix-${cert}`;
  const controlId = `${productId}-${suffix}`;
  const readonlySelectedLabel = `${meta.title} voor ${productLabel} — vast gekozen, niet wijzigbaar`;
  const lockedExtraLabel = `${meta.title} vast gekozen voor ${productLabel}`;
  const naLabel = `${meta.title} niet beschikbaar voor ${productLabel}`;
  const editableLabel = `${meta.title} voor ${productLabel} — toevoegen of verwijderen`;

  const ariaLabel =
    mode === "primary-readonly"
      ? readonlySelectedLabel
      : mode === "extra-locked"
        ? lockedExtraLabel
        : naLabel;

  const shellClass = cn(
    "flex min-h-10 flex-col items-center justify-center gap-micro rounded-md py-component",
    mode === "editable" &&
      "cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
    mode !== "editable" && mode !== "unavailable" && "cursor-not-allowed",
    mode === "unavailable" && "cursor-default opacity-60",
  );

  const control = (
    <Checkbox
      id={mode === "editable" ? controlId : undefined}
      checked={checked}
      disabled={mode !== "editable"}
      tabIndex={mode === "editable" ? undefined : -1}
      aria-label={mode === "editable" ? undefined : ariaLabel}
      aria-describedby={ceSublabel ? `${controlId}-ce-level` : undefined}
      onCheckedChange={
        mode === "editable" ? (state) => onCheckedChange?.(state === true) : undefined
      }
      className={cn(
        mode !== "editable" && "cursor-not-allowed",
        (mode === "primary-readonly" || mode === "extra-locked") &&
          checked &&
          MATRIX_CERT_CHECKBOX_READONLY_CHECKED_CLASS,
      )}
    />
  );

  const levelLine =
    ceSublabel != null && ceSublabel !== "" ? (
      <span
        id={`${controlId}-ce-level`}
        className="max-w-[6.5rem] text-center text-xs font-medium leading-snug tracking-wide text-muted-foreground"
      >
        {ceSublabel}
      </span>
    ) : null;

  const body = (
    <>
      {control}
      {levelLine}
    </>
  );

  if (mode === "editable") {
    return (
      <label htmlFor={controlId} className={shellClass}>
        <span className="sr-only">{editableLabel}</span>
        {body}
      </label>
    );
  }

  return <div className={shellClass}>{body}</div>;
}

export function BundleProductCard({ product, selected, onToggle }: BundleProductCardProps) {
  const matrix = useContext(BundleMatrixContext);
  const inMatrix = matrix != null;
  const rowPrimary = product.rowPrimaryCert;

  if (!inMatrix) {
    return (
      <div
        role="row"
        aria-label={`BundleProductCard vereist BundleMatrixProvider (product ${product.label})`}
        className={cn(
          "grid items-stretch gap-component rounded-lg border border-destructive/50 bg-card px-component py-component",
          bundleMatrixGridCols.all,
        )}
      >
        <p className="col-span-full text-sm text-destructive">
          Bundle-matrix: gebruik BundleMatrixProvider met primaryCert en matrixExtraCerts.
        </p>
      </div>
    );
  }

  const { matrixExtraCerts } = matrix;

  const ceSublabel = bundleMatrixCeSublabel(product.ceAvailabilityRaw);

  return (
    <div
      role="row"
      aria-label={`Extra certificaties voor ${product.label}`}
      className={cn(
        "grid items-stretch gap-component rounded-lg border bg-card px-component py-component transition-colors",
        "col-span-full grid-cols-subgrid",
      )}
    >
      <div className="flex min-w-0 items-center">
        <ProductLabelLine label={product.label} trail={product.categoryTrail} />
      </div>
      <MatrixCertCheckboxCell
        productId={product.id}
        productLabel={product.label}
        cert={rowPrimary}
        mode="primary-readonly"
        checked
        ceSublabel={rowPrimary === "ce" ? ceSublabel : undefined}
      />
      {matrixExtraCerts.map((cert) => {
        const datasetOk = product.availableBundleCerts.includes(cert);
        const lockedPrimary = cert === rowPrimary;
        const isChecked = lockedPrimary || selected.has(cert);

        const cellCeSublabel = cert === "ce" ? ceSublabel : undefined;

        if (!datasetOk) {
          return (
            <MatrixCertCheckboxCell
              key={cert}
              productId={product.id}
              productLabel={product.label}
              cert={cert}
              mode="unavailable"
              checked={false}
              ceSublabel={cellCeSublabel}
            />
          );
        }

        if (lockedPrimary) {
          return (
            <MatrixCertCheckboxCell
              key={cert}
              productId={product.id}
              productLabel={product.label}
              cert={cert}
              mode="extra-locked"
              checked
              ceSublabel={cellCeSublabel}
            />
          );
        }

        return (
          <MatrixCertCheckboxCell
            key={cert}
            productId={product.id}
            productLabel={product.label}
            cert={cert}
            mode="editable"
            checked={isChecked}
            onCheckedChange={(next) => onToggle(cert, next)}
            ceSublabel={cellCeSublabel}
          />
        );
      })}
    </div>
  );
}
