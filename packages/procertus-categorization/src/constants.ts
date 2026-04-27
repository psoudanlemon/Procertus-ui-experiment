import type { CertificationLabelKey, ProductAttestationKey } from "./types";

export const CERTIFICATION_LABEL_ORDER: readonly CertificationLabelKey[] = [
  "ce",
  "benor",
  "ssd",
] as const;

export const CERTIFICATION_LABEL_META: Readonly<
  Record<CertificationLabelKey, { short: string; description: string }>
> = {
  ce: { short: "CE", description: "CE marking" },
  benor: { short: "BENOR", description: "BENOR" },
  ssd: { short: "SSD", description: "Sortie du Statut de Déchets" },
} as const;

export const PRODUCT_ATTESTATION_ORDER: readonly ProductAttestationKey[] = [
  "atg",
  "procertus",
  "epd",
] as const;

export const PRODUCT_ATTESTATION_META: Readonly<
  Record<ProductAttestationKey, { short: string; description: string }>
> = {
  atg: { short: "ATG", description: "ATG-attest" },
  procertus: { short: "PROCERTUS", description: "PROCERTUS-attest" },
  epd: { short: "EPD", description: "Environmental Product Declaration" },
} as const;
