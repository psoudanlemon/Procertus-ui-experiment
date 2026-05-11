import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChoiceCard,
  ChoiceCardGroup,
} from "@procertus-ui/ui";

export const BUNDLE_CERT_ORDER = ["benor", "ce", "atg"] as const;
export type BundleCertKey = (typeof BUNDLE_CERT_ORDER)[number];

export type BundleCertMeta = { title: string; description: string };

/**
 * Presentational copy per certification. Geëxporteerd zodat pages het pakket-brede
 * "Hoofdcertificatie" pillen en eventuele andere headers consistent kunnen labelen.
 */
export const BUNDLE_CERT_META: Record<BundleCertKey, BundleCertMeta> = {
  benor: {
    title: "BENOR",
    description: "Belgische vrijwillige certificatie volgens de PTV-voorschriften.",
  },
  ce: {
    title: "CE-markering",
    description: "Verklaring van conformiteit met de Europese verordening 305/2011.",
  },
  atg: {
    title: "ATG-attest",
    description: "Technische goedkeuring met gekoppelde productcertificatie.",
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

/**
 * Eén productkaart in de "Stel je aanvraagpakket samen"-stap. Toont het categoriepad
 * en productlabel als header, gevolgd door een {@link ChoiceCardGroup} met de
 * aanvullende certificaties die bovenop de hoofdcertificatie kunnen worden gekozen.
 */
export function BundleProductCard({ product, selected, onToggle }: BundleProductCardProps) {
  return (
    <Card className="flex-row items-center gap-component py-region">
      <CardHeader className="gap-micro px-region shrink-0">
        <span className="text-xs leading-tight text-muted-foreground">
          {product.categoryTrail}
        </span>
        <CardTitle className="text-base font-semibold">{product.label}</CardTitle>
      </CardHeader>
      <CardContent className="ml-auto px-region">
        <ChoiceCardGroup
          aria-label={`Extra certificaties voor ${product.label}`}
          selectionMode="multiple"
          layout="stack"
          className="flex-row flex-wrap gap-component"
        >
          {product.extraCerts.map((cert) => {
            const meta = BUNDLE_CERT_META[cert];
            const isChecked = selected.has(cert);
            return (
              <ChoiceCard
                key={cert}
                value={cert}
                controlId={`${product.id}-${cert}`}
                title={meta.title}
                controlPosition="trailing"
                selectionMode="multiple"
                checked={isChecked}
                onCheckedChange={(next) => onToggle(cert, next)}
                className="w-auto"
              />
            );
          })}
        </ChoiceCardGroup>
      </CardContent>
    </Card>
  );
}
