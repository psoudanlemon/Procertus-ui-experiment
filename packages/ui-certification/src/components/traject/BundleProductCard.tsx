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

export const BUNDLE_CERT_ORDER = ["benor", "ce", "ssd", "procertus"] as const;
export type BundleCertKey = (typeof BUNDLE_CERT_ORDER)[number];

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
 * Producten kunnen alleen aan deze vier certificatie-trajecten gekoppeld worden.
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
};

export type BundleProduct = {
  id: string;
  label: string;
  /** Volledig categoriepad als platte string, identiek aan de basketrij-prefix. */
  categoryTrail: string;
  /** Certificaties die de gebruiker bovenop de hoofdcertificatie kan kiezen. */
  extraCerts: readonly BundleCertKey[];
};

export type BundleProductCardProps = {
  product: BundleProduct;
  selected: ReadonlySet<BundleCertKey>;
  onToggle: (cert: BundleCertKey, checked: boolean) => void;
};

type MatrixContextValue = {
  /**
   * Hoofdcertificatie van het pakket. Wanneer ingesteld, wordt deze cert uit
   * de matrix-kolommen gefilterd: de pagina-kicker toont hem al en herhaling
   * binnen elke productrij is overbodig.
   */
  primaryCert: BundleCertKey | null;
};

const BundleMatrixContext = createContext<MatrixContextValue | null>(null);

export type BundleMatrixProviderProps = {
  children: ReactNode;
  /**
   * Hoofdcertificatie waarin de pagina staat. Wordt uit de matrix-kolommen
   * gefilterd zodat de matrix alleen de toggleable extras toont.
   */
  primaryCert?: BundleCertKey;
};

/**
 * Geeft het gedeeld matrix-grid + hoofdcertificatie door aan alle
 * {@link BundleProductCard}s. Verwacht zelf in een parent te zitten die de
 * matrix-kolommen definieert (zie {@link bundleMatrixGridCols}).
 */
export function BundleMatrixProvider({ children, primaryCert }: BundleMatrixProviderProps) {
  const value = useMemo<MatrixContextValue>(
    () => ({ primaryCert: primaryCert ?? null }),
    [primaryCert],
  );
  return (
    <BundleMatrixContext.Provider value={value}>{children}</BundleMatrixContext.Provider>
  );
}

/**
 * Tailwind grid-template-columns voor de matrix. Twee statische varianten zodat
 * Tailwind JIT de class-strings tijdens build kan vinden:
 *
 * - `all`: één productinfo-kolom + alle vier cert-kolommen (5 cols totaal).
 * - `excludingPrimary`: één productinfo-kolom + drie cert-kolommen (4 cols totaal),
 *   gebruikt wanneer de hoofdcertificatie al uit de pagina-context blijkt.
 */
export const bundleMatrixGridCols = {
  all: "grid-cols-[1fr_repeat(4,7rem)]",
  excludingPrimary: "grid-cols-[1fr_repeat(3,7rem)]",
} as const;

function visibleCerts(primaryCert: BundleCertKey | null): readonly BundleCertKey[] {
  return primaryCert == null
    ? BUNDLE_CERT_ORDER
    : BUNDLE_CERT_ORDER.filter((cert) => cert !== primaryCert);
}

/**
 * Toont een categoriepad in root-to-leaf volgorde met `›` (U+203A) als leidende
 * marker én als separator tussen de segmenten, zodat alle chevrons visueel
 * even zwaar wegen.
 */
function formatCategoryTrail(trail: string): string {
  const segments = trail.split(" > ").filter(Boolean);
  return segments.length === 0 ? "" : `› ${segments.join(" › ")}`;
}

/**
 * Productlabel + breadcrumb op één regel, met truncate-detectie. Wanneer de
 * regel visueel afgekapt wordt, verschijnt na ~1.5s hover een tooltip met de
 * volledige productnaam. ResizeObserver houdt het truncate-flag bij wanneer
 * de kolombreedte of viewport verandert.
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
      {trail ? (
        <span className="ms-component text-xs font-normal text-muted-foreground">
          {trail}
        </span>
      ) : null}
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
  const certs = visibleCerts(matrix?.primaryCert ?? null);
  return (
    <div
      role="row"
      className="col-span-full grid grid-cols-subgrid items-end gap-component px-component pb-micro"
    >
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Gekozen product
      </span>
      {certs.map((cert) => (
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
  /** Hoofdcertificatie van het pakket; wordt uit de extras-lijst gefilterd. */
  primaryCert: BundleCertKey;
};

/**
 * Mobiele variant van {@link BundleProductCard}: verticaal gestapelde ChoiceCards
 * onder een sticky product-header. Toont één full-width ChoiceCard per beschikbare
 * extra-cert met expliciete "Voeg X toe"-labels (kolom-headers ontbreken hier).
 * De hoofdcertificatie wordt overgeslagen omdat de pagina-context die al communiceert.
 */
export function BundleProductMobileCard({
  product,
  selected,
  onToggle,
  primaryCert,
}: BundleProductMobileCardProps) {
  const trail = formatCategoryTrail(product.categoryTrail);
  const extras = BUNDLE_CERT_ORDER.filter(
    (cert) => cert !== primaryCert && product.extraCerts.includes(cert),
  );

  return (
    <article
      aria-label={`Aanvraagpakket voor ${product.label}`}
      className="overflow-hidden rounded-lg border bg-card"
    >
      <header className="sticky top-0 z-10 bg-card/95 px-section py-component backdrop-blur-sm">
        <ProductLabelLine label={product.label} trail={trail} />
      </header>
      <div className="flex flex-col gap-component p-section pt-0">
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

export function BundleProductCard({ product, selected, onToggle }: BundleProductCardProps) {
  const matrix = useContext(BundleMatrixContext);
  const inMatrix = matrix != null;
  const trail = formatCategoryTrail(product.categoryTrail);
  const certs = visibleCerts(matrix?.primaryCert ?? null);
  const standaloneGridCols =
    matrix?.primaryCert != null
      ? bundleMatrixGridCols.excludingPrimary
      : bundleMatrixGridCols.all;

  return (
    <div
      role="row"
      aria-label={`Extra certificaties voor ${product.label}`}
      className={cn(
        "grid items-stretch gap-component rounded-lg border bg-card px-component py-component transition-colors",
        inMatrix ? "col-span-full grid-cols-subgrid" : standaloneGridCols,
      )}
    >
      <div className="flex min-w-0 items-center">
        <ProductLabelLine label={product.label} trail={trail} />
      </div>
      {certs.map((cert) => {
        const available = product.extraCerts.includes(cert);
        const isChecked = selected.has(cert);

        if (!available) {
          return (
            <div
              key={cert}
              aria-hidden
              className="flex items-center justify-center py-component"
            >
              <Checkbox disabled tabIndex={-1} />
            </div>
          );
        }

        const controlId = `${product.id}-${cert}`;
        return (
          <label
            key={cert}
            htmlFor={controlId}
            className="flex h-full cursor-pointer items-center justify-center rounded-md py-component transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span className="sr-only">
              {`${BUNDLE_CERT_META[cert].title} voor ${product.label}`}
            </span>
            <Checkbox
              id={controlId}
              checked={isChecked}
              onCheckedChange={(next) => onToggle(cert, next === true)}
            />
          </label>
        );
      })}
    </div>
  );
}
